import Link from "next/link";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";
import { siteConfig, socialLinks } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  mail: <Mail size={18} />,
  linkedin: <Linkedin size={18} />,
  github: <Github size={18} />,
};

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-muted">
        <MapPin size={18} className="text-accent shrink-0" />
        <span className="text-sm">
          {siteConfig.location} — Open to remote worldwide
        </span>
      </div>

      <div className="space-y-3">
        {socialLinks.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-muted hover:text-accent transition-colors group"
          >
            <span className="p-2 rounded-lg border border-border group-hover:border-accent group-hover:text-accent transition-colors">
              {iconMap[link.icon]}
            </span>
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
