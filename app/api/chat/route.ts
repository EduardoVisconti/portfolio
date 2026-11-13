import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { ASSISTANT_CONTEXT } from '@/lib/assistant-context';
import {
  createRateLimiter,
  firstAvailable,
  frameAnswer,
  toGeminiHistory,
  type Msg,
} from '@/lib/chat';

export const runtime = 'nodejs';

/**
 * Gemini, on the free tier: this console has to run without a paid API account,
 * and Google AI Studio grants a permanent free allowance (no card) that is far
 * more than a portfolio consumes. The key must come from a project with billing
 * off - with billing on, every call draws on prepaid credit, and when that ran
 * out the console went down with a 402 instead of falling back to free.
 *
 * The system prompt asks for 2-5 sentences, so latency matters more than
 * depth, and Flash-Lite is the right shape: measured on 2026-11-13 it opened
 * its stream in about half a second while Flash took 20 to 45 seconds or
 * returned 503. Flash stays as the second choice for when Lite is the busy one.
 * Both are `-latest` aliases, which follow Google's current model, so retiring
 * one model name no longer takes the console down; an alias can still move to
 * a model that behaves differently, which is what the fallback is for. Tried
 * in order - see firstAvailable.
 */
const MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest'] as const;
const HEADERS_MS = 10_000;     // Lite's wait before Flash steps in; Lite opened in ~0.5s

// The last model has no deadline of its own (see firstAvailable), so this is
// what bounds a visitor's wait. Sixty seconds is also the ceiling a Hobby
// project allows without fluid compute, so the value is valid either way.
export const maxDuration = 60;
const MAX_TURNS = 12;          // conversation depth cap
const MAX_CHARS = 1200;        // per-message input cap

// Public and unauthenticated, so it needs a ceiling. Logic and tests live in
// lib/chat.ts - the numbers are the only part that belongs here.
const refuse = createRateLimiter({
  ipWindowMs: 60 * 60 * 1000,
  ipMax: 20,
  dayMax: 500,
});

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'unconfigured' }, { status: 503 });
  }

  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    const refusal = refuse(ip);
    if (refusal) {
      // Two different remedies, so two different answers.
      return NextResponse.json({ error: refusal === 'ip' ? 'rate_limited' : 'daily_limit' },
        { status: 429 });
    }

    const body = (await req.json()) as { messages?: Msg[] };
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    const { history, latest } = toGeminiHistory(incoming, {
      maxTurns: MAX_TURNS,
      maxChars: MAX_CHARS,
    });
    if (!latest) {
      return NextResponse.json({ error: 'no messages' }, { status: 400 });
    }

    // What visitors ask is the one dataset this site can generate about itself,
    // and it answers the question the system prompt was written by guessing at:
    // which facts people actually come here for. It goes to the runtime log
    // rather than to a database, because the volume is tens of rows a month and
    // this pipeline states the repo ships no backend, no database and no user
    // data - buying storage for that would contradict the claim.
    //
    // The question text only. `ip` is in scope a few lines up and must never
    // join this line: the rate limiter needs an address, the dataset does not,
    // and a question next to an address is a different thing to hold than a
    // question. Retention is the log's, which makes this a sample rather than a
    // record - a log drain is the upgrade, and it is config, not code.
    console.log(JSON.stringify({
      evt: 'chat_q',
      ts: new Date().toISOString(),
      q: latest.parts[0].text,
      prior: history.length,
    }));

    const genAI = new GoogleGenerativeAI(key);
    const open = (model: string, signal: AbortSignal) => genAI.getGenerativeModel({
      model,
      systemInstruction: ASSISTANT_CONTEXT,
      generationConfig: {
        // There is deliberately no thinkingConfig. Each model accepts a
        // different one - Flash-Lite rejects `thinkingBudget: 0` with a 400 and
        // Flash rejects `thinkingLevel: 'minimal'` - so behind an alias that
        // moves, any value is a future outage. Without it every model answered.
        //
        // The cost: thinking tokens are billed against maxOutputTokens, and a
        // model that reasons long enough can spend all 2048 and stop with
        // MAX_TOKENS before its answer is done. Nothing here prevents that. A
        // 2-5 sentence answer needs a small fraction of the budget, which makes
        // it unlikely, and when it happens frameAnswer reports it as `empty` or
        // `truncated` instead of passing it off as a finished answer.
        maxOutputTokens: 2048,
        temperature: 0.4,
      },
    }).startChat({ history }).sendMessageStream(latest.parts[0].text, { signal });

    // Anything that fails before the first byte still gets a status code, which
    // is why this await sits out here rather than inside the stream. Past the
    // first byte the status is spent and failure can only travel as an event.
    // That is also the only point where another model can still step in.
    const gone = new AbortController();
    req.signal.addEventListener('abort', () => gone.abort(), { once: true });
    const result = await firstAvailable(MODELS, open, {
      headersMs: HEADERS_MS,
      gone: gone.signal,
      skipped: (model, err) => console.error('[api/chat] skipped', model, err),
    });

    const encoder = new TextEncoder();
    const lines = frameAnswer(result.stream, {
      // The reason the generation ended rides on the aggregate rather than on
      // any chunk, and does not exist until the stream is drained - which is
      // exactly when frameAnswer asks for it. Anything but STOP was cut short:
      // maxOutputTokens is the likely one here, a safety or recitation trip the
      // rest. All of them end the stream without throwing, so this is the only
      // thing standing between a truncated answer and a completion marker.
      finishReason: async () => (await result.response).candidates?.[0]?.finishReason,
      empty: (reason) => console.error('[api/chat] empty reply', reason),
      truncated: (reason) => console.error('[api/chat] truncated', reason),
      // A visitor leaving aborts the stream on purpose; that is not a failure.
      // The SDK still logs the aborted read once on its own, which no option
      // of ours can silence.
      failed: (err) => { if (!gone.signal.aborted) console.error('[api/chat] stream', err); },
    });

    // `pull` rather than a loop inside `start`: the next line is only framed
    // once the previous one has been taken, so a slow reader does not get the
    // whole answer queued into memory behind it.
    return new Response(
      new ReadableStream<Uint8Array>({
        async pull(controller) {
          const { value, done } = await lines.next();
          if (done) controller.close();
          else controller.enqueue(encoder.encode(value));
        },
        // A visitor who closes the tab mid-answer should stop the generation,
        // not keep spending the day's allowance on nobody. Returning from
        // `lines` alone stopped reading one half of the SDK's tee while the
        // other kept downloading; aborting the fetch ends both.
        cancel: () => {
          gone.abort();
          void lines.return(undefined);
        },
      }),
      {
        headers: {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (err) {
    console.error('[api/chat]', err);
    // The client owns the user-facing fallback copy (ASK.fallback).
    return NextResponse.json({ error: 'upstream' }, { status: 502 });
  }
}
