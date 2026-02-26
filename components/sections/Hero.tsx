'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { heroData } from '@/lib/data';

const container = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.2, delayChildren: 0.3 }
	}
};

const item = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: 'easeOut' as const }
	}
};

export default function Hero() {
	return (
		<section className='relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-background'>
			{/* ── Orb 1: large green — top left ── */}
			<motion.div
				className='absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-green-300 opacity-20 blur-[120px] will-change-transform'
				animate={{
					x: [0, 60, -30, 0],
					y: [0, -40, 30, 0],
					scale: [1, 1.2, 0.9, 1]
				}}
				transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
			/>

			{/* ── Orb 2: blue — bottom right ── */}
			<motion.div
				className='absolute -bottom-48 -right-32 w-[700px] h-[700px] rounded-full bg-blue-300 opacity-15 blur-[130px] will-change-transform'
				animate={{
					x: [0, -60, 40, 0],
					y: [0, 50, -30, 0],
					scale: [1, 1.1, 1.25, 1]
				}}
				transition={{
					duration: 17,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 2
				}}
			/>

			{/* ── Orb 3: green — center right, smaller ── */}
			<motion.div
				className='absolute top-1/2 right-[10%] w-[350px] h-[350px] rounded-full bg-emerald-200 opacity-20 blur-[80px] will-change-transform'
				animate={{
					x: [0, 30, -40, 0],
					y: [0, -50, 20, 0],
					scale: [1, 1.3, 0.85, 1]
				}}
				transition={{
					duration: 11,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 5
				}}
			/>

			{/* ── Orb 4: purple accent — top right ── */}
			<motion.div
				className='absolute -top-20 right-[20%] w-[280px] h-[280px] rounded-full bg-violet-200 opacity-15 blur-[70px] will-change-transform'
				animate={{
					x: [0, -20, 50, 0],
					y: [0, 40, -20, 0],
					scale: [1, 0.9, 1.2, 1]
				}}
				transition={{
					duration: 9,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 3
				}}
			/>

			{/* ── Content ── */}
			<motion.div
				variants={container}
				initial='hidden'
				animate='visible'
				className='relative z-10 max-w-3xl text-center'
			>
				<motion.p
					variants={item}
					className='text-sm uppercase tracking-widest text-accent font-medium mb-4'
				>
					{heroData.role}
				</motion.p>

				<motion.h1
					variants={item}
					className='text-5xl sm:text-6xl md:text-7xl font-display font-bold text-foreground leading-tight mb-6'
				>
					{heroData.headline}
				</motion.h1>

				<motion.p
					variants={item}
					className='text-lg md:text-xl text-muted max-w-xl mx-auto mb-10 text-balance'
				>
					{heroData.subtitle}
				</motion.p>

				<motion.div
					variants={item}
					className='flex flex-col sm:flex-row items-center justify-center gap-4'
				>
					<a
						href='#projects'
						className='inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition-colors'
					>
						{heroData.ctaPrimary}
						<ArrowDown size={16} />
					</a>
					<Link
						href='/contact'
						className='inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full font-medium text-foreground hover:border-accent hover:text-accent transition-colors'
					>
						{heroData.ctaSecondary}
						<ArrowRight size={16} />
					</Link>
				</motion.div>
			</motion.div>
		</section>
	);
}
