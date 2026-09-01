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

export const metadata: Metadata = {
  title: 'Eduardo Visconti — AI Engineer · Full-Stack',
  description:
    'Production systems where an LLM agent is part of the runtime. Budget ceilings, ' +
    'approval gates, failure classification, self-healing.',
  openGraph: {
    title: 'Eduardo Visconti — AI Engineer · Full-Stack',
    description: 'Production systems where an LLM agent is part of the runtime.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
