import { Project, TimelineItem, TechItem, SocialLink } from '@/types';

export const siteConfig = {
	name: 'Eduardo Visconti',
	role: 'Frontend Developer',
	location: 'Tampa, FL',
	email: 'eduardo.visconti.dev@gmail.com',
	linkedin: 'https://linkedin.com/in/eduardovisconti',
	github: 'https://github.com/eduardovisconti'
};

export const heroData = {
	headline: 'Eduardo Visconti',
	role: 'Frontend Developer',
	subtitle: 'Building modern web experiences with React, TypeScript & Next.js',
	ctaPrimary: 'View My Work',
	ctaSecondary: 'Get in Touch'
};

export const aboutData = {
	bio: [
		"I'm a frontend developer based in Tampa, FL, focused on building clean, performant, and user-friendly web applications.",
		"I work with React, TypeScript, Next.js, and modern tools like TanStack Query, Zustand, and Tailwind CSS. I'm passionate about creating interfaces that are both beautiful and functional.",
		"Currently open to new opportunities — let's build something great together."
	],
	stats: [
		{ label: 'Projects', value: '10+' },
		{ label: 'Technologies', value: '12+' },
		{ label: 'Years Coding', value: '4+' }
	]
};

export const projectsData: Project[] = [
	{
		title: 'AssetOps',
		tag: 'SaaS Dashboard',
		description:
			'Enterprise asset management dashboard with real-time tracking, advanced filtering, and data visualization.',
		tech: ['React', 'TypeScript', 'TanStack Table', 'Zustand', 'TailwindCSS'],
		image: '/projects/assetops.png',
		liveUrl: 'https://asset-ops.vercel.app/login',
		githubUrl: 'https://github.com/EduardoVisconti/AssetOps'
	},
	{
		title: 'ResumeAI',
		tag: 'AI Tool',
		description:
			'AI-powered resume analyzer with ATS scoring, keyword analysis, and cover letter generation.',
		tech: ['Next.js', 'TypeScript', 'Anthropic Claude API', 'TailwindCSS'],
		image: '/projects/resumeai.png',
		liveUrl: 'https://resumeai-analyze.vercel.app/',
		githubUrl: 'https://github.com/EduardoVisconti/resume-analyzer'
	},
	{
		title: 'Ozyn Fit',
		tag: 'Fitness App',
		description:
			'Fitness tracking application for workout management and progress monitoring.',
		tech: ['React', 'TypeScript', 'Firebase', 'TailwindCSS'],
		image: '/projects/ozynfit.png',
		liveUrl: 'https://ozynfit.web.app/',
		githubUrl: 'https://github.com/EduardoVisconti/ozyn'
	},
	{
		title: 'Psychology Practice',
		tag: 'Client Project',
		description:
			'Professional landing page for a psychology practice with modern design and contact integration.',
		tech: ['React', 'TypeScript', 'TailwindCSS'],
		image: '/projects/psychology.png',
		liveUrl: 'https://suelirepulho.com.br/'
	}
];

export const techStackData: TechItem[] = [
	{ name: 'React', icon: 'react' },
	{ name: 'Next.js', icon: 'nextjs' },
	{ name: 'TypeScript', icon: 'typescript' },
	{ name: 'JavaScript', icon: 'javascript' },
	{ name: 'TailwindCSS', icon: 'tailwindcss' },
	{ name: 'Zustand', icon: 'zustand' },
	{ name: 'TanStack Query', icon: 'tanstack' },
	{ name: 'React Hook Form', icon: 'reacthookform' },
	{ name: 'Zod', icon: 'zod' },
	{ name: 'Firebase', icon: 'firebase' },
	{ name: 'Git', icon: 'git' },
	{ name: 'Vercel', icon: 'vercel' }
];

export const experienceData: TimelineItem[] = [
	{
		year: '2025 — Present',
		title: 'Freelance Frontend Developer',
		subtitle: 'Self-employed',
		description:
			'Building web applications for clients, specializing in React/Next.js dashboards, landing pages, and AI-integrated tools.',
		type: 'work'
	},
	{
		year: '2026',
		title: 'ResumeAI',
		subtitle: 'Personal Project',
		description:
			'Built an AI-powered resume analysis tool with Claude API integration, ATS scoring, and cover letter generation.',
		type: 'project'
	},
	{
		year: '2025',
		title: 'AssetOps',
		subtitle: 'Personal Project',
		description:
			'Designed and developed a full SaaS-style asset management dashboard with real-time tracking and advanced filtering.',
		type: 'project'
	},
	{
		year: '2024 — 2026',
		title: 'Systems Analysis and Development',
		subtitle: 'Anhanguera Educacional',
		description:
			'Associate degree in Computer Science covering systems analysis, software development, and IT fundamentals.',
		type: 'education'
	},
	{
		year: '2023 — 2024',
		title: 'IT Fundamentals',
		subtitle: 'CompTIA Tech Career Academy',
		description:
			'Comprehensive IT fundamentals program covering system maintenance, networking, and technical skills.',
		type: 'education'
	},
	{
		year: '2022 — 2023',
		title: 'Web Development — Explorer Program',
		subtitle: 'Rocketseat',
		description:
			'Intensive full-stack web development program covering front-end and back-end technologies.',
		type: 'education'
	},
	{
		year: '2021 — 2023',
		title: 'Frontend Development',
		subtitle: 'Alura',
		description:
			'Completed multiple tracks in HTML, CSS, JavaScript, and React with hands-on projects.',
		type: 'education'
	},
	{
		year: '2019 — 2020',
		title: 'Web Development',
		subtitle: 'Truckee Meadows Community College',
		description:
			'Studied web technologies, CSS, JavaScript, and responsive design fundamentals.',
		type: 'education'
	}
];

export const socialLinks: SocialLink[] = [
	{
		name: 'Email',
		url: 'mailto:eduardo.visconti.dev@gmail.com',
		icon: 'mail'
	},
	{
		name: 'LinkedIn',
		url: 'https://linkedin.com/in/eduardovisconti',
		icon: 'linkedin'
	},
	{
		name: 'GitHub',
		url: 'https://github.com/eduardovisconti',
		icon: 'github'
	}
];

export const aiSystemPrompt = `You are Eduardo Visconti's AI assistant on his portfolio website.
You answer questions about Eduardo in a friendly, professional,
and slightly casual tone. Keep answers concise (2-3 sentences max).

About Eduardo:
- Frontend developer based in Tampa, FL area
- Works with React, TypeScript, Next.js, TailwindCSS, TanStack Query,
  Zustand, React Hook Form, Zod
- Open to remote opportunities globally
- Projects: AssetOps (SaaS dashboard), ResumeAI (AI tool),
  Ozyn Fit (fitness app), Psychology practice landing page
- Passionate about clean code, modern UI, and AI integration
- Currently building portfolio projects and seeking new opportunities
- Education: Systems Analysis & Development (Anhanguera), CompTIA IT Fundamentals,
  Rocketseat Web Dev, Alura Frontend tracks, TMCC Web Development

Rules:
- Only answer questions related to Eduardo's professional profile,
  skills, projects, and availability.
- If asked something personal or off-topic, politely redirect:
  "I can help with questions about Eduardo's work and skills!
  What would you like to know?"
- Never make up information. If unsure, say:
  "I'm not sure about that — you can reach Eduardo directly
  at his email for more details!"
- Be brief and natural. No corporate jargon.`;
