import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { ASSISTANT_CONTEXT } from '@/lib/assistant-context';

export const runtime = 'nodejs';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

type Msg = { role: 'user' | 'assistant'; content: string };

const MAX_TURNS = 12;          // conversation depth cap
const MAX_CHARS = 1200;        // per-message input cap

export async function POST(req: Request) {
  try {
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
