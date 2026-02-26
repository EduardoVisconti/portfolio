'use client';

import { motion } from 'framer-motion';
import { Briefcase, Code2, GraduationCap } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import { experienceData } from '@/lib/data';

const typeIcons = {
	work: <Briefcase size={15} />,
	project: <Code2 size={15} />,
	education: <GraduationCap size={15} />
};

const typeColors = {
	work: 'bg-accent text-white',
	project: 'bg-blue-500 text-white',
	education: 'bg-purple-500 text-white'
};

function TimelineList({ items }: { items: typeof experienceData }) {
	return (
		<div className='relative'>
			{/* vertical line */}
			<div className='absolute left-4 top-0 bottom-0 w-px bg-border' />

			<div className='space-y-8'>
				{items.map((exp, i) => (
					<motion.div
						key={`${exp.title}-${i}`}
						initial={{ opacity: 0, x: -16 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: '-40px' }}
						transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
						className='relative flex gap-6 pl-12'
					>
						{/* dot */}
						<div
							className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${typeColors[exp.type]}`}
						>
							{typeIcons[exp.type]}
						</div>

						<div>
							<span className='text-xs uppercase tracking-wider text-accent font-medium'>
								{exp.year}
							</span>
							<h3 className='text-base font-semibold text-foreground mt-0.5'>
								{exp.title}
							</h3>
							<p className='text-sm text-muted font-medium'>{exp.subtitle}</p>
							<p className='text-sm text-muted mt-1.5 leading-relaxed'>
								{exp.description}
							</p>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}

export default function Experience() {
	const workItems = experienceData.filter(
		(e) => e.type === 'work' || e.type === 'project'
	);
	const educationItems = experienceData.filter((e) => e.type === 'education');

	return (
		<section
			id='experience'
			className='py-16 md:py-24 bg-card'
		>
			<div className='max-w-6xl mx-auto px-6'>
				<SectionTitle
					label='Experience'
					title='My journey'
				/>

				<div className='grid md:grid-cols-2 gap-12 md:gap-16'>
					{/* Work & Projects */}
					<div>
						<div className='flex items-center gap-2 mb-8'>
							<div className='w-7 h-7 rounded-full bg-accent flex items-center justify-center'>
								<Briefcase
									size={14}
									className='text-white'
								/>
							</div>
							<h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
								Work & Projects
							</h3>
						</div>
						<TimelineList items={workItems} />
					</div>

					{/* Education */}
					<div>
						<div className='flex items-center gap-2 mb-8'>
							<div className='w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center'>
								<GraduationCap
									size={14}
									className='text-white'
								/>
							</div>
							<h3 className='text-sm font-semibold text-foreground uppercase tracking-wider'>
								Education
							</h3>
						</div>
						<TimelineList items={educationItems} />
					</div>
				</div>
			</div>
		</section>
	);
}
