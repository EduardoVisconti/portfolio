export interface Project {
  title: string;
  tag: string;
  description: string;
  tech: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: "work" | "project" | "education";
}

export interface TechItem {
  name: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
