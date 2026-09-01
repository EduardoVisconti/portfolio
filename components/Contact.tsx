'use client';

import { useState } from 'react';
import { CONTACT, IDENTITY } from '@/lib/content';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const field =
    'w-full border-0 border-b border-field bg-transparent px-0 pb-[15px] pt-3 text-base ' +
    'text-ink outline-none transition-colors focus:border-accent focus-visible:border-accent';
  const label = 'font-mono text-m-10 tracking-t9 text-ink-label';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();

    const next: Record<string, string> = {};
    if (!name) next.name = CONTACT.errors.name;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = CONTACT.errors.email;
    if (!message) next.message = CONTACT.errors.message;
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      data-screen-label="07 Contact"
      className="pb-section-end pt-section"
    >
      <div className="mb-[clamp(40px,5vw,64px)]">
        <SectionHeader n="07" title="Contact" aside="RESEND · REPLIES FROM ME" />
      </div>

      <Reveal range={24} className="flex flex-wrap gap-[clamp(44px,6vw,96px)]">
        <div className="max-w-[520px] flex-[1_1_340px]">
          <h2 className="mb-7 mt-0 font-display text-d-contact font-normal text-ink [text-wrap:pretty]">
            {CONTACT.headline}
          </h2>
          <p className="mb-10 mt-0 max-w-[420px] text-p-body-l text-ink-muted [text-wrap:pretty]">
            {CONTACT.support}
          </p>
          <div className="flex flex-col gap-[14px] border-t border-rule pt-[26px]">
            <a href={`mailto:${IDENTITY.email}`} className="font-mono text-m-13 tracking-t1 text-ink">
              {IDENTITY.email}
            </a>
            <div className="flex flex-wrap gap-x-6 gap-y-[10px] font-mono text-m-11-r tracking-t6 text-ink-muted">
              <a href={IDENTITY.linkedin} target="_blank" rel="noopener">LINKEDIN ↗</a>
              <a href={IDENTITY.github} target="_blank" rel="noopener">GITHUB ↗</a>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex max-w-[540px] flex-[1_1_380px] flex-col gap-1">
          <label htmlFor="c-name" className={`${label} pt-2`}>NAME</label>
          <input id="c-name" name="name" className={`${field} mb-[22px]`} autoComplete="name" />
          {errors.name ? <span className="-mt-4 mb-4 font-mono text-m-11-r tracking-t6 text-ink-muted">{errors.name}</span> : null}

          <label htmlFor="c-email" className={label}>EMAIL</label>
          <input id="c-email" name="email" type="email" className={`${field} mb-[22px]`} autoComplete="email" />
          {errors.email ? <span className="-mt-4 mb-4 font-mono text-m-11-r tracking-t6 text-ink-muted">{errors.email}</span> : null}

          <label htmlFor="c-message" className={label}>MESSAGE</label>
          {/* font-sans is explicit: browsers default textareas to monospace. */}
          <textarea
            id="c-message"
            name="message"
            rows={4}
            className={`${field} mb-[30px] resize-y font-sans leading-[1.5]`}
          />
          {errors.message ? <span className="-mt-6 mb-5 font-mono text-m-11-r tracking-t6 text-ink-muted">{errors.message}</span> : null}

          <div className="flex flex-wrap items-center gap-[18px]">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex cursor-pointer items-center gap-3 border-0 bg-accent px-7 py-[15px] font-mono text-m-11 font-medium tracking-t8 text-accent-ink transition-colors hover:bg-ink disabled:opacity-60"
            >
              {status === 'sending' ? 'SENDING…' : 'SEND MESSAGE →'}
            </button>
            {status === 'sent' ? (
              <span className="font-mono text-m-11-r tracking-t6 text-accent">{CONTACT.success}</span>
            ) : null}
            {status === 'error' ? (
              <span className="font-mono text-m-11-r tracking-t6 text-ink-muted">{CONTACT.errors.send}</span>
            ) : null}
          </div>
        </form>
      </Reveal>
    </section>
  );
}
