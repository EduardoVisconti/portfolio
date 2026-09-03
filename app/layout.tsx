import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from 'next/font/google';
import './globals.css';

const display = Instrument_Serif({
  subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'],
  display: 'swap', variable: '--font-display',
});
const sans = Instrument_Sans({
  subsets: ['latin'], weight: ['400', '500', '600'],
  display: 'swap', variable: '--font-sans',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin'], weight: ['400', '500'],
  display: 'swap', variable: '--font-mono',
});

import { IDENTITY, SITE } from '@/lib/content';

const TITLE = 'Eduardo Visconti — AI Engineer · Full-Stack';
const DESCRIPTION =
  'Production systems where an LLM agent is part of the runtime. Budget ceilings, ' +
  'approval gates, failure classification, self-healing.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: SITE,
    siteName: 'Eduardo Visconti',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {/* Structured data is how an extractor reads him correctly instead of
            guessing from prose. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfilePage',
              mainEntity: {
                '@type': 'Person',
                name: 'Eduardo Visconti',
                jobTitle: 'AI Engineer',
                description: DESCRIPTION,
                email: `mailto:${IDENTITY.email}`,
                url: SITE,
                worksFor: { '@type': 'Organization', name: IDENTITY.employer },
                address: { '@type': 'PostalAddress', addressLocality: 'Tampa', addressRegion: 'FL', addressCountry: 'US' },
                knowsLanguage: ['en', 'pt', 'es'],
                knowsAbout: [
                  'Large language model agents', 'Python', 'FastAPI', 'TypeScript',
                  'React', 'Next.js', 'React Native', 'PostgreSQL', 'Browser automation',
                ],
                sameAs: [IDENTITY.linkedin, IDENTITY.github],
              },
            }),
          }}
        />
        {children}
        {/* Passive search means the useful question is which post sent someone
            and where they stopped reading, not how many hits there were. */}
        <Analytics />
      </body>
    </html>
  );
}
