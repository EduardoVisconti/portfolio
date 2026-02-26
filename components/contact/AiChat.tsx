'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
	role: 'user' | 'assistant';
	content: string;
}

const suggestions = [
	"What are Eduardo's strongest skills?",
	'Tell me about LeadFlow CRM',
	'Is Eduardo open to new opportunities?',
	'What AI integrations has he built?'
];

export default function AiChat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, loading]);

	async function send(text: string) {
		if (!text.trim() || loading) return;
		const userMsg: Message = { role: 'user', content: text };
		setMessages((prev) => [...prev, userMsg]);
		setInput('');
		setLoading(true);

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: [...messages, userMsg]
				})
			});
			const data = await res.json();
			setMessages((prev) => [
				...prev,
				{ role: 'assistant', content: data.reply }
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content: 'Something went wrong. Try again!'
				}
			]);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='flex flex-col h-[520px] rounded-2xl border border-border bg-background overflow-hidden'>
			{/* Header */}
			<div className='flex items-center gap-3 px-5 py-4 border-b border-border bg-card'>
				<div className='w-8 h-8 rounded-full bg-accent flex items-center justify-center'>
					<Bot
						size={16}
						className='text-white'
					/>
				</div>
				<div>
					<p className='text-sm font-semibold text-foreground'>AI Assistant</p>
					<p className='text-xs text-muted'>Ask me anything about Eduardo</p>
				</div>
				<div className='ml-auto flex items-center gap-1.5'>
					<span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
					<span className='text-xs text-muted'>Online</span>
				</div>
			</div>

			{/* Messages */}
			<div className='flex-1 overflow-y-auto px-5 py-4 space-y-4'>
				{messages.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className='space-y-3'
					>
						<p className='text-sm text-muted text-center pt-4'>
							👋 Hi! Ask me anything about Eduardo.
						</p>
						<div className='flex flex-wrap gap-2 justify-center pt-2'>
							{suggestions.map((s) => (
								<button
									key={s}
									onClick={() => send(s)}
									className='text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted hover:border-accent hover:text-accent transition-colors'
								>
									{s}
								</button>
							))}
						</div>
					</motion.div>
				)}

				<AnimatePresence initial={false}>
					{messages.map((msg, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.25 }}
							className={`flex gap-2.5 ${
								msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
							}`}
						>
							<div
								className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
									msg.role === 'user'
										? 'bg-accent text-white'
										: 'bg-card border border-border text-muted'
								}`}
							>
								{msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
							</div>
							<div
								className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
									msg.role === 'user'
										? 'bg-accent text-white rounded-tr-sm'
										: 'bg-card border border-border text-foreground rounded-tl-sm'
								}`}
							>
								{msg.content}
							</div>
						</motion.div>
					))}
				</AnimatePresence>

				{loading && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className='flex gap-2.5 items-center'
					>
						<div className='w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center'>
							<Bot
								size={13}
								className='text-muted'
							/>
						</div>
						<div className='px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border'>
							<Loader2
								size={14}
								className='animate-spin text-muted'
							/>
						</div>
					</motion.div>
				)}

				<div ref={bottomRef} />
			</div>

			{/* Input */}
			<div className='px-4 py-3 border-t border-border bg-card'>
				<div className='flex gap-2'>
					<input
						type='text'
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && send(input)}
						placeholder='Ask about Eduardo...'
						disabled={loading}
						className='flex-1 px-4 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50'
					/>
					<button
						onClick={() => send(input)}
						disabled={loading || !input.trim()}
						className='w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-dark transition-colors disabled:opacity-40 shrink-0'
					>
						<Send size={15} />
					</button>
				</div>
			</div>
		</div>
	);
}
