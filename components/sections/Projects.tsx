'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import SectionTitle from '@/components/shared/SectionTitle';
import { projectsData } from '@/lib/data';

const cardVariants = {
	hidden: { opacity: 0, y: 40 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' as const }
	})
};

const tagColors: Record<string, string> = {
	'Asset Management Platform': 'bg-blue-50 text-blue-600',
	'AI Tool': 'bg-purple-50 text-purple-600',
	'E-commerce Platform': 'bg-orange-50 text-orange-600',
	'Client Project': 'bg-accent-light text-accent-dark'
};

export default function Projects() {
	const [imageError, setImageError] = useState<Record<string, boolean>>({});
	return (
		<section
			id='projects'
			className='py-16 md:py-24 bg-card'
		>
			<div className='max-w-6xl mx-auto px-6'>
				<SectionTitle
					label='Projects'
					title='Selected work'
				/>

				<div className='grid sm:grid-cols-2 gap-6'>
					{projectsData.map((project, i) => (
						<motion.article
							key={project.title}
							custom={i}
							variants={cardVariants}
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true, margin: '-60px' }}
							whileHover={{ y: -4, transition: { duration: 0.2 } }}
							className='group bg-background rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow'
						>
							{/* Image placeholder */}
							<div className='relative aspect-video bg-gradient-to-br from-card to-border flex items-center justify-center'>
								{!imageError[project.title] ? (
									<Image
										src={project.image}
										alt={`${project.title} preview`}
										fill
										className='object-cover'
										sizes='(max-width: 640px) 100vw, 50vw'
										onError={() =>
											setImageError((prev) => ({
												...prev,
												[project.title]: true
											}))
										}
									/>
								) : (
									<span className='text-sm text-muted'>
										{project.title} preview
									</span>
								)}
							</div>

							<div className='p-6'>
								<div className='flex items-center justify-between mb-3'>
									<h3 className='text-lg font-semibold text-foreground'>
										{project.title}
									</h3>
									<span
										className={`text-xs font-medium px-2.5 py-1 rounded-full ${
											tagColors[project.tag] || 'bg-card text-muted'
										}`}
									>
										{project.tag}
									</span>
								</div>

								<p className='text-sm text-muted leading-relaxed mb-4'>
									{project.description}
								</p>

								<div className='flex flex-wrap gap-1.5 mb-5'>
									{project.tech.map((t) => (
										<span
											key={t}
											className='text-xs px-2 py-0.5 rounded bg-card text-muted border border-border'
										>
											{t}
										</span>
									))}
								</div>

								<div className='flex items-center gap-3'>
									{project.liveUrl && (
										<Link
											href={project.liveUrl}
											target='_blank'
											rel='noopener noreferrer'
											className='inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark transition-colors'
										>
											<ExternalLink size={14} />
											Live Demo
										</Link>
									)}
									{project.githubUrl && (
										<Link
											href={project.githubUrl}
											target='_blank'
											rel='noopener noreferrer'
											className='inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors'
										>
											<Github size={14} />
											Code
										</Link>
									)}
								</div>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
