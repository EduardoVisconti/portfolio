import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { aiSystemPrompt } from '@/lib/data';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
	try {
		if (!process.env.GEMINI_API_KEY) {
			return NextResponse.json(
				{ error: 'GEMINI_API_KEY not configured' },
				{ status: 500 }
			);
		}

		const { messages } = await req.json();

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.5-flash',
			systemInstruction: aiSystemPrompt
		});

		// Build history for multi-turn (all except last message)
		const history = messages
			.slice(0, -1)
			.map((m: { role: string; content: string }) => ({
				role: m.role === 'user' ? 'user' : 'model',
				parts: [{ text: m.content }]
			}));

		const chat = model.startChat({ history });

		const lastMessage = messages[messages.length - 1];
		const result = await chat.sendMessage(lastMessage.content);
		const reply = result.response.text();

		return NextResponse.json({ reply });
	} catch (error) {
		console.error('Chat error:', error);

		// Fallback to gemini-2.0-flash if 2.5 not available
		try {
			const { messages } = await req.json().catch(() => ({ messages: [] }));
			const model = genAI.getGenerativeModel({
				model: 'gemini-2.0-flash',
				systemInstruction: aiSystemPrompt
			});
			const lastMessage = messages[messages.length - 1];
			const result = await model.generateContent(lastMessage?.content || '');
			return NextResponse.json({ reply: result.response.text() });
		} catch {
			return NextResponse.json(
				{
					reply:
						"Sorry, I'm having trouble connecting right now. You can reach Eduardo directly at eduardo.visconti.dev@gmail.com!"
				},
				{ status: 200 }
			);
		}
	}
}
