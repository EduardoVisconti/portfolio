import { GoogleGenerativeAI, type GenerationConfig } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { ASSISTANT_CONTEXT } from '@/lib/assistant-context';
import { createRateLimiter, frameAnswer, toGeminiHistory, type Msg } from '@/lib/chat';

export const runtime = 'nodejs';

/**
 * Gemini, on the free tier: this console has to run without a paid API account,
 * and Google AI Studio grants a permanent free allowance (no card) that is far
 * more than a portfolio consumes. Flash is also the right shape for the job -
 * the system prompt asks for 2-5 sentences, so latency matters more than depth.
 */
const MODEL = 'gemini-2.5-flash';
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

    const model = new GoogleGenerativeAI(key).getGenerativeModel({
      model: MODEL,
      systemInstruction: ASSISTANT_CONTEXT,
      generationConfig: {
        // Thinking is on by default on 2.5 Flash and its tokens are billed
        // against maxOutputTokens. Left alone the model can spend the whole
        // budget reasoning and return MAX_TOKENS with no text - a 200 carrying
        // an empty string, which the console then reports as an outage.
        //
        // thinkingConfig is honoured by the REST API but absent from this
        // SDK's types, hence the cast. The headroom below is the belt to that
        // brace: even if the field is dropped in transit, 2048 tokens leaves
        // room for a 2-5 sentence answer after any amount of thinking, and an
        // answer of nothing is now an error event rather than a silent success.
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 2048,
        temperature: 0.4,
      } as GenerationConfig,
    });

    const chat = model.startChat({ history });
    // Anything that fails before the first byte still gets a status code, which
    // is why this await sits out here rather than inside the stream. Past the
    // first byte the status is spent and failure can only travel as an event.
    const result = await chat.sendMessageStream(latest.parts[0].text);

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
      failed: (err) => console.error('[api/chat] stream', err),
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
        // not keep spending the day's allowance on nobody.
        cancel: () => void lines.return(undefined),
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
