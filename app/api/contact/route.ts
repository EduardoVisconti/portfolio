import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, message } = (await req.json()) as {
      name?: string; email?: string; message?: string;
    };

    const n = String(name ?? '').trim().slice(0, 120);
    const e = String(email ?? '').trim().slice(0, 200);
    const m = String(message ?? '').trim().slice(0, 5000);

    if (!n || !m || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    await resend.emails.send({
      from: process.env.CONTACT_FROM!,          // e.g. site@yourdomain.com
      to: process.env.CONTACT_TO!,              // eduardo.visconti.dev@gmail.com
      replyTo: e,
      subject: `Portfolio — ${n}`,
      text: `From: ${n} <${e}>\n\n${m}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/contact]', err);
    return NextResponse.json({ error: 'send failed' }, { status: 502 });
  }
}
