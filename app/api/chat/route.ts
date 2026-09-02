import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { ASSISTANT_CONTEXT } from '@/lib/assistant-context';

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

/**
 * Cost and quota guard. This route is public and unauthenticated, so without a
 * ceiling one script can burn the daily free allowance. Two limits, both in
 * memory: a per-IP sliding window and a global daily cap as the backstop.
 *
 * Serverless instances do not share memory, so these are per-instance and
 * therefore soft. They stop casual abuse and bot sweeps, not a determined
 * distributed attacker - for that, rate limit at the edge.
 */
const IP_WINDOW_MS = 60 * 60 * 1000;   // 1 hour
const IP_MAX = 20;                     // questions per IP per window
const DAY_MAX = 500;                   // questions per instance per day

const hits = new Map<string, number[]>();
let day = new Date().toISOString().slice(0, 10);
let dayCount = 0;

function overLimit(ip: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    dayCount = 0;
    hits.clear();
  }
  if (++dayCount > DAY_MAX) return true;

  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (recent.length >= IP_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) hits.clear();   // unbounded-growth guard
  return false;
}

type Msg = { role: 'user' | 'assistant'; content: string };

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'unconfigured' }, { status: 503 });
  }

  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (overLimit(ip)) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const body = (await req.json()) as { messages?: Msg[] };
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    if (!incoming.length) {
      return NextResponse.json({ error: 'no messages' }, { status: 400 });
    }

    // Trim: keep the last MAX_TURNS exchanges, clamp each message length.
    const turns = incoming
      .slice(-MAX_TURNS * 2)
      .map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: String(m.content ?? '').slice(0, MAX_CHARS) }],
      }))
      .filter((m) => m.parts[0].text.length > 0);

    // Gemini takes the history separately from the message being answered, and
    // a history must open on a user turn.
    const latest = turns.pop();
    if (!latest) {
      return NextResponse.json({ error: 'no messages' }, { status: 400 });
    }
    while (turns.length && turns[0].role !== 'user') turns.shift();

    const model = new GoogleGenerativeAI(key).getGenerativeModel({
      model: MODEL,
      systemInstruction: ASSISTANT_CONTEXT,
      generationConfig: { maxOutputTokens: 600, temperature: 0.4 },
    });

    const chat = model.startChat({ history: turns });
    const result = await chat.sendMessage(latest.parts[0].text);
    const reply = result.response.text().trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[api/chat]', err);
    // The client owns the user-facing fallback copy (ASK.fallback).
    return NextResponse.json({ error: 'upstream' }, { status: 502 });
  }
}
