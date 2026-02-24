'use client';

import { useState, type FormEvent } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
	const [sending, setSending] = useState(false);
	const [sent, setSent] = useState(false);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSending(true);

		try {
			const form = e.currentTarget;
			const formData = new FormData(form);

			const payload = {
				name: String(formData.get('name') ?? ''),
				email: String(formData.get('email') ?? ''),
				message: String(formData.get('message') ?? '')
			};

			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error || 'Failed to send message');
			}

			setSent(true);
			form.reset();
		} catch (error) {
			console.error(error);
			alert('Sorry, something went wrong while sending your message.');
		} finally {
			setSending(false);
		}
	}

	if (sent) {
		return (
			<div className='flex flex-col items-center justify-center py-12 text-center'>
				<CheckCircle
					size={48}
					className='text-accent mb-4'
				/>
				<h3 className='text-xl font-semibold text-foreground mb-2'>
					Message sent!
				</h3>
				<p className='text-sm text-muted'>
					Thanks for reaching out. I&apos;ll get back to you soon.
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-5'
		>
			<div>
				<label
					htmlFor='name'
					className='block text-sm font-medium text-foreground mb-1.5'
				>
					Name
				</label>
				<input
					id='name'
					name='name'
					type='text'
					required
					placeholder='Your name'
					className='w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'
				/>
			</div>

			<div>
				<label
					htmlFor='email'
					className='block text-sm font-medium text-foreground mb-1.5'
				>
					Email
				</label>
				<input
					id='email'
					name='email'
					type='email'
					required
					placeholder='you@example.com'
					className='w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'
				/>
			</div>

			<div>
				<label
					htmlFor='message'
					className='block text-sm font-medium text-foreground mb-1.5'
				>
					Message
				</label>
				<textarea
					id='message'
					name='message'
					required
					rows={5}
					placeholder='Tell me about your project...'
					className='w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none'
				/>
			</div>

			<button
				type='submit'
				disabled={sending}
				className='inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition-colors disabled:opacity-60'
			>
				{sending ? 'Sending...' : 'Send Message'}
				<Send size={16} />
			</button>
		</form>
	);
}
