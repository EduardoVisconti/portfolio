import { FOOTER } from '@/lib/content';

export function SiteFooter() {
  return (
    <footer className="flex flex-wrap items-center gap-x-8 gap-y-[14px] border-t border-rule pb-10 pt-[26px] font-mono text-m-10-r tracking-t7 text-ink-faint">
      <span>{FOOTER.copyright}</span>
      <span>{FOOTER.place}</span>
      <span className="ml-auto">{FOOTER.built}</span>
    </footer>
  );
}
