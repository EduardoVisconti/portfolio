import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig, socialLinks } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  mail: <Mail size={18} />,
  linkedin: <Linkedin size={18} />,
  github: <Github size={18} />,
};

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors"
              aria-label={link.name}
            >
              {iconMap[link.icon]}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
