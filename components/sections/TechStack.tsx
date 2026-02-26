'use client';

import { motion } from 'framer-motion';
import SectionTitle from '@/components/shared/SectionTitle';
import { techStackData } from '@/lib/data';

const techIcons: Record<string, string> = {
	react: '⚛️',
	nextjs: '▲',
	typescript: 'TS',
	javascript: 'JS',
	tailwindcss: '🎨',
	zustand: '🐻',
	tanstack: '🔄',
	reacthookform: '📋',
	zod: '✓',
	firebase: '🔥',
	git: '🔀',
	vercel: '▲',
	supabase: '🟢',
	nodejs: '🟩',
	claude: '🤖',
	gemini: '✨'
};

const container = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.2 }
	}
};

const item = {
	hidden: { opacity: 0, scale: 0.8, y: 20 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { duration: 0.4, ease: 'easeOut' as const }
	}
};

export default function TechStack() {
	return (
		<section
			id='tech'
			className='py-16 md:py-24'
		>
			<div className='max-w-6xl mx-auto px-6'>
				<SectionTitle
					label='Tech Stack'
					title='Tools I work with'
				/>

				<motion.div
					variants={container}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-60px' }}
					className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4'
				>
					{techStackData.map((tech) => (
						<motion.div
							key={tech.name}
							variants={item}
							whileHover={{ y: -4, transition: { duration: 0.2 } }}
							className='flex flex-col items-center gap-2 p-5 rounded-xl border border-border bg-background hover:border-accent hover:shadow-sm transition-all cursor-default'
						>
							<span className='text-2xl leading-none select-none'>
								{techIcons[tech.icon] || '•'}
							</span>
							<span className='text-xs font-medium text-muted text-center'>
								{tech.name}
							</span>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
