import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content';

/**
 * Sourcing in 2026 runs through model-driven agents as much as through search,
 * so the crawlers that read on their behalf are allowed explicitly rather than
 * left to a wildcard someone might tighten later.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: ['ClaudeBot', 'Claude-User', 'GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'Google-Extended'], allow: '/' },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
