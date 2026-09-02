import { GoogleGenerativeAI, type GenerationConfig } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { ASSISTANT_CONTEXT } from '@/lib/assistant-context';
import { createRateLimiter, toGeminiHistory, type Msg } from '@/lib/chat';

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
        // empty body is now a 502 rather than a silent 200.
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 2048,
        temperature: 0.4,
      } as GenerationConfig,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(latest.parts[0].text);
    const reply = result.response.text().trim();

    // An empty body is a failure, not an answer. Returning 200 with '' makes
    // the client fall back while the telemetry beside it reports a healthy
    // round trip.
    if (!reply) {
      console.error('[api/chat] empty reply', result.response.candidates?.[0]?.finishReason);
      return NextResponse.json({ error: 'empty' }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[api/chat]', err);
    // The client owns the user-facing fallback copy (ASK.fallback).
    return NextResponse.json({ error: 'upstream' }, { status: 502 });
  }
}
