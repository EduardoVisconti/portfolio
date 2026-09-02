import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { ASSISTANT_CONTEXT } from '@/lib/assistant-context';

export const runtime = 'nodejs';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

type Msg = { role: 'user' | 'assistant'; content: string };

const MAX_TURNS = 12;          // conversation depth cap
const MAX_CHARS = 1200;        // per-message input cap

/**
 * Cost guard. This route is public and unauthenticated, so without a ceiling a
 * single script can spend the API budget. Two limits, both in memory:
 * a per-IP sliding window, and a global daily cap as the backstop.
 *
 * Serverless instances do not share memory, so these are per-instance and
 * therefore soft. They stop casual abuse and bot sweeps, not a determined
 * distributed attacker - for that, put a rate limit at the edge (Vercel
 * Firewall) or move the counters to a shared store.
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

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (overLimit(ip)) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const body = (await req.json()) as { messages?: Msg[] };
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    if (!incoming.length) {
      return NextResponse.json({ error: 'no messages' }, { status: 400 });
    }

    // Trim: keep the last MAX_TURNS exchanges, clamp each message length.
    const messages = incoming
      .slice(-MAX_TURNS * 2)
      .map((m) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: String(m.content ?? '').slice(0, MAX_CHARS),
      }))
      .filter((m) => m.content.length > 0);

    const res = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 600,
      system: ASSISTANT_CONTEXT,
      messages,
    });

    const reply = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[api/chat]', err);
    // The client owns the user-facing fallback copy (ASK.fallback).
    return NextResponse.json({ error: 'upstream' }, { status: 502 });
  }
}
