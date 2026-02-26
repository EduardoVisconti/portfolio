'use client';

import { motion } from 'framer-motion';
import SectionTitle from '@/components/shared/SectionTitle';

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
	supabase: '🟢',
	firebase: '🔥',
	nodejs: '🟩',
	claude: '🤖',
	gemini: '✨',
	git: '🔀',
	vercel: '▲'
};

const categories = [
	{
		label: 'Frontend',
		techs: [
			{ name: 'React', icon: 'react' },
			{ name: 'Next.js', icon: 'nextjs' },
			{ name: 'TypeScript', icon: 'typescript' },
			{ name: 'JavaScript', icon: 'javascript' },
			{ name: 'TailwindCSS', icon: 'tailwindcss' }
		]
	},
	{
		label: 'State & Data',
		techs: [
			{ name: 'TanStack Query', icon: 'tanstack' },
			{ name: 'Zustand', icon: 'zustand' },
			{ name: 'React Hook Form', icon: 'reacthookform' },
			{ name: 'Zod', icon: 'zod' }
		]
	},
	{
		label: 'Backend & DB',
		techs: [
			{ name: 'Supabase', icon: 'supabase' },
			{ name: 'Firebase', icon: 'firebase' },
			{ name: 'Node.js', icon: 'nodejs' }
		]
	},
	{
		label: 'AI',
		techs: [
			{ name: 'Claude API', icon: 'claude' },
			{ name: 'Gemini API', icon: 'gemini' }
		]
	},
	{
		label: 'Tools',
		techs: [
			{ name: 'Git', icon: 'git' },
			{ name: 'Vercel', icon: 'vercel' }
		]
	}
];

const container = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.06, delayChildren: 0.1 }
	}
};

const chip = {
	hidden: { opacity: 0, scale: 0.8, y: 16 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { duration: 0.35, ease: 'easeOut' as const }
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

				<div className='space-y-8'>
					{categories.map((cat, ci) => (
						<motion.div
							key={cat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-40px' }}
							transition={{ duration: 0.4, delay: ci * 0.08, ease: 'easeOut' }}
						>
							{/* Category label */}
							<p className='text-xs uppercase tracking-widest text-accent font-medium mb-3'>
								{cat.label}
							</p>

							{/* Tech chips */}
							<motion.div
								variants={container}
								initial='hidden'
								whileInView='visible'
								viewport={{ once: true, margin: '-40px' }}
								className='flex flex-wrap gap-2'
							>
								{cat.techs.map((tech) => (
									<motion.div
										key={tech.name}
										variants={chip}
										whileHover={{ y: -3, transition: { duration: 0.15 } }}
										className='flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background hover:border-accent hover:shadow-sm transition-all cursor-default'
									>
										<span className='text-base leading-none select-none'>
											{techIcons[tech.icon] || '•'}
										</span>
										<span className='text-sm font-medium text-foreground'>
											{tech.name}
										</span>
									</motion.div>
								))}
							</motion.div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
