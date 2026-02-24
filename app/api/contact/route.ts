import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const name = String(body?.name ?? '').trim();
		const email = String(body?.email ?? '').trim();
		const message = String(body?.message ?? '').trim();

		if (!name || !email || !message) {
			return NextResponse.json(
				{ error: 'Missing required fields.' },
				{ status: 400 }
			);
		}

		if (!process.env.RESEND_API_KEY) {
			return NextResponse.json(
				{ error: 'Server email config missing: RESEND_API_KEY' },
				{ status: 500 }
			);
		}

		if (!process.env.CONTACT_TO_EMAIL) {
			return NextResponse.json(
				{ error: 'Server email config missing: CONTACT_TO_EMAIL' },
				{ status: 500 }
			);
		}

		const resend = new Resend(process.env.RESEND_API_KEY); // ✅ aqui dentro

		const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

		const { error } = await resend.emails.send({
			from,
			to: [process.env.CONTACT_TO_EMAIL],
			replyTo: email,
			subject: `New portfolio contact from ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
		});

		if (error) {
			console.error('Resend error:', error);
			return NextResponse.json(
				{ error: 'Failed to send email.' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		console.error('Contact API error:', err);
		return NextResponse.json(
			{ error: 'Unexpected server error.' },
			{ status: 500 }
		);
	}
}
