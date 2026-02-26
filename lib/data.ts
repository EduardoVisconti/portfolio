import { Project, TimelineItem, TechItem, SocialLink } from '@/types';

export const siteConfig = {
	name: 'Eduardo Visconti',
	role: 'Frontend Developer',
	location: 'Tampa, FL',
	email: 'eduardo.visconti.dev@gmail.com',
	linkedin: 'https://linkedin.com/in/eduardo-visconti',
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
		{ label: 'Projects', value: '4+' },
		{ label: 'Technologies', value: '15+' },
		{ label: 'Years Coding', value: '4+' }
	]
};

export const projectsData: Project[] = [
	{
		title: 'LeadFlow CRM',
		tag: 'CRM Platform',
		description:
			'Full CRM for electronics resellers — Kanban pipeline with drag-and-drop, contact and company database, product catalog with stock management, tasks with overdue alerts, and AI-powered deal health analysis via Google Gemini.',
		tech: [
			'Next.js',
			'TypeScript',
			'Supabase',
			'Google Gemini API',
			'TanStack Query',
			'TailwindCSS'
		],
		image: '/projects/leadflow.png',
		liveUrl: 'https://leadflow-electronics.vercel.app',
		githubUrl: 'https://github.com/EduardoVisconti/leadflow'
	},
	{
		title: 'ResumeAI',
		tag: 'AI Tool',
		description:
			'AI-powered resume analyzer with ATS scoring, keyword gap detection, and cover letter generation using the Anthropic Claude API.',
		tech: ['Next.js', 'TypeScript', 'Anthropic Claude API', 'TailwindCSS'],
		image: '/projects/resumeai.png',
		liveUrl: 'https://resumeai-analyzer.vercel.app/',
		githubUrl: 'https://github.com/EduardoVisconti/resume-analyzer'
	},
	{
		title: 'AssetOps',
		tag: 'Enterprise Platform',
		description:
			'Enterprise asset management platform with role-based access control, maintenance scheduling, audit logs, and real-time analytics dashboards.',
		tech: [
			'React',
			'TypeScript',
			'Firebase',
			'TanStack Query',
			'Zustand',
			'TailwindCSS'
		],
		image: '/projects/assetops.png',
		liveUrl: 'https://asset-ops.vercel.app/login',
		githubUrl: 'https://github.com/EduardoVisconti/AssetOps'
	},
	{
		title: 'Ozyn Fit',
		tag: 'E-commerce Platform',
		description:
			'Full-stack e-commerce app with product catalog, shopping cart, Firebase authentication, and Stripe Checkout integration.',
		tech: ['React', 'TypeScript', 'Firebase', 'Stripe', 'TailwindCSS'],
		image: '/projects/ozynfit.png',
		liveUrl: 'https://ozynfit.web.app/',
		githubUrl: 'https://github.com/EduardoVisconti/ozyn'
	}
];

export const techStackData: TechItem[] = [
	{ name: 'React', icon: 'react' },
	{ name: 'Next.js', icon: 'nextjs' },
	{ name: 'TypeScript', icon: 'typescript' },
	{ name: 'JavaScript', icon: 'javascript' },
	{ name: 'TailwindCSS', icon: 'tailwindcss' },
	{ name: 'TanStack Query', icon: 'tanstack' },
	{ name: 'Zustand', icon: 'zustand' },
	{ name: 'React Hook Form', icon: 'reacthookform' },
	{ name: 'Zod', icon: 'zod' },
	{ name: 'Supabase', icon: 'supabase' },
	{ name: 'Firebase', icon: 'firebase' },
	{ name: 'Node.js', icon: 'nodejs' },
	{ name: 'Claude API', icon: 'claude' },
	{ name: 'Gemini API', icon: 'gemini' },
	{ name: 'Git', icon: 'git' },
	{ name: 'Vercel', icon: 'vercel' }
];

export const experienceData: TimelineItem[] = [
	{
		year: 'Jan 2025 — Present',
		title: 'Freelance Frontend Developer',
		subtitle: 'Self-employed · Remote',
		description:
			'Building production web applications and AI-integrated tools using React, Next.js, TypeScript, Supabase, and Firebase. Managing full project lifecycle from requirements to Vercel deployment.',
		type: 'work'
	},
	{
		year: 'Aug 2024 — Nov 2025',
		title: 'Insurance Agent',
		subtitle: 'HealthInsurance.com · Tampa, FL',
		description:
			'Operated web-based CRM systems with high accuracy in client data management. Provided bilingual support (English/Spanish) for a broad U.S. consumer base.',
		type: 'work'
	},
	{
		year: '2026',
		title: 'LeadFlow CRM',
		subtitle: 'Personal Project',
		description:
			'Full CRM for electronics resellers with Kanban pipeline, product catalog, tasks, activity history, and AI-powered deal analysis via Google Gemini.',
		type: 'project'
	},
	{
		year: '2025',
		title: 'ResumeAI',
		subtitle: 'Personal Project',
		description:
			'AI-powered resume analyzer with ATS scoring, keyword gap detection, and cover letter generation via Anthropic Claude API.',
		type: 'project'
	},
	{
		year: '2025',
		title: 'AssetOps',
		subtitle: 'Personal Project',
		description:
			'Enterprise asset management platform with role-based access, maintenance scheduling, audit logs, and analytics dashboard.',
		type: 'project'
	},
	{
		year: '2024 — 2026',
		title: 'Systems Analysis and Development',
		subtitle: 'Anhanguera Educacional',
		description:
			'Associate degree covering systems analysis, software development, databases, and IT fundamentals.',
		type: 'education'
	},
	{
		year: '2023 — 2024',
		title: 'IT Fundamentals',
		subtitle: 'CompTIA Tech Career Academy',
		description:
			'Comprehensive IT program covering system maintenance, networking, and technical support fundamentals.',
		type: 'education'
	},
	{
		year: '2022 — 2023',
		title: 'Web Development Bootcamp',
		subtitle: 'Rocketseat',
		description:
			'Intensive full-stack program covering modern frontend and backend technologies with hands-on projects.',
		type: 'education'
	},
	{
		year: '2021 — 2023',
		title: 'Frontend Development',
		subtitle: 'Alura',
		description:
			'Multiple tracks in HTML, CSS, JavaScript, and React with real-world project implementations.',
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
		url: 'https://linkedin.com/in/eduardo-visconti',
		icon: 'linkedin'
	},
	{
		name: 'GitHub',
		url: 'https://github.com/eduardovisconti',
		icon: 'github'
	}
];

export const aiSystemPrompt = `You are Eduardo Visconti's AI assistant on his portfolio website.
You answer questions about Eduardo in a friendly, professional, and slightly casual tone.
Keep answers concise (2-3 sentences max).

About Eduardo:
- Frontend developer based in Tampa, FL
- Works with React, TypeScript, Next.js, Tailwind CSS, TanStack Query, Zustand,
  React Hook Form, Zod, Supabase (PostgreSQL), Firebase
- AI integration experience: Anthropic Claude API, Google Gemini API, OpenAI API,
  prompt engineering, streaming responses
- Trilingual: English (fluent), Portuguese (native), Spanish (fluent)
- Open to remote opportunities worldwide or on-site in Tampa Bay area

Projects:
- LeadFlow CRM: full CRM for electronics resellers — Kanban pipeline, contacts, product catalog,
  tasks, activity history, AI deal analysis via Google Gemini. Live at leadflow-electronics.vercel.app
- ResumeAI: resume analyzer with ATS scoring, keyword gap detection, and AI cover letter generation
  using the Anthropic Claude API. Live at resumeai-analyzer.vercel.app
- AssetOps: enterprise asset management platform with role-based access, maintenance scheduling,
  audit logs, and real-time analytics. Live at asset-ops.vercel.app
- Ozyn Fit: full-stack e-commerce with Firebase auth and Stripe Checkout. Live at ozynfit.web.app

Education:
- Systems Analysis & Development — Anhanguera Educacional (2024–2026, in progress)
- CompTIA IT Fundamentals — CompTIA Tech Career Academy (2023–2024)
- Web Development Bootcamp — Rocketseat (2022–2023)
- Frontend Development — Alura (2021–2023)

Rules:
- Only answer questions related to Eduardo's professional profile, skills, projects, and availability.
- If asked something personal or off-topic, politely redirect:
  "I can help with questions about Eduardo's work and skills! What would you like to know?"
- Never make up information. If unsure, say:
  "I'm not sure about that — you can reach Eduardo directly at his email for more details!"
- Be brief and natural. No corporate jargon.`;
