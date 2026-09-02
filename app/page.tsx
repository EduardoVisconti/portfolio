import { AskMeAnything } from '@/components/AskMeAnything';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import { Contact } from '@/components/Contact';
import { Hero } from '@/components/Hero';
import { Numbers } from '@/components/Numbers';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SectionRail } from '@/components/SectionRail';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Stack } from '@/components/Stack';
import { Thinking } from '@/components/Thinking';
import { Work } from '@/components/Work';

export default function Page() {
  return (
    <div className="relative overflow-x-hidden bg-bg">
      <ScrollProgress />
      <BackgroundGrid />
      <SiteHeader />
      <SectionRail />

      <main className="relative z-[1] mx-auto max-w-container px-gutter">
        <Hero />
        <Work />
        <Thinking />
        <Numbers />
        <Stack />
        <AskMeAnything />
        <Contact />
        <SiteFooter />
      </main>
    </div>
  );
}
