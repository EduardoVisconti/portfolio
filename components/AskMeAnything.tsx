'use client';

import { useEffect, useRef, useState } from 'react';
import { ASK } from '@/lib/content';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';

type Msg = { role: 'user' | 'assistant'; content: string };

/**
 * The flex: a portfolio that answers questions about its owner. It gets a full
 * section and a console frame — never a floating corner bubble. The telemetry
 * row is what tells an engineer it is real, so keep it accurate.
 */
export function AskMeAnything() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [turns, setTurns] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Instant, not animated — animated scroll fights the user.
  useEffect(() => {
    const box = scrollRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages, busy]);

  async function ask(question?: string) {
    const text = (question ?? inputRef.current?.value ?? '').trim();
    if (!text || busy) return;
    if (inputRef.current) inputRef.current.value = '';

    const history = messages;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setBusy(true);

    const t0 = performance.now();
    let reply = ASK.fallback;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: text }] }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.reply === 'string' && data.reply.trim()) reply = data.reply.trim();
      } else if (res.status === 429) {
        // The guard is doing its job; saying "unreachable" would be a lie.
        reply = ASK.rateLimited;
      } else if (res.status === 503) {
        reply = ASK.unconfigured;
      }
    } catch {
      /* keep fallback */
    }

    setLatency(Math.round(performance.now() - t0));
    setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    setTurns((t) => t + 1);
    setBusy(false);
  }

  const status = busy ? 'GENERATING' : messages.length ? 'READY' : 'IDLE';

  return (
    <section id="ask" className="py-section">
      <div className="mb-[clamp(34px,4vw,52px)]">
        <SectionHeader n="06" title="Ask Me Anything" aside="LIVE · /api/chat" />
      </div>

      <Reveal
        range={24}
        className="mb-[clamp(30px,4vw,44px)] flex flex-wrap items-start gap-x-[clamp(40px,6vw,80px)] gap-y-8"
      >
        <h2 className="m-0 max-w-[620px] flex-[1_1_380px] font-display text-d-ask font-normal text-ink [text-wrap:pretty]">
          {ASK.headBefore}
          <span className="italic text-accent">{ASK.headAccent}</span>
          {ASK.headAfter}
        </h2>
        <p className="m-0 max-w-[380px] flex-[1_1_280px] text-p-small text-ink-muted [text-wrap:pretty]">
          {ASK.support}
        </p>
      </Reveal>

      <Reveal range={26} className="border border-strong bg-surface">
        {/* title bar */}
        <div className="flex items-center gap-3 border-b border-panel bg-titlebar px-[18px] py-[13px]">
          <span className="h-1.5 w-1.5 animate-pulse bg-accent" aria-hidden />
          <span className="font-mono text-m-10 font-medium tracking-t8 text-ink-muted">
            EV · ASSISTANT
          </span>
          <span className="ml-auto font-mono text-m-10 tracking-t6 text-ink-faint" aria-live="polite">
            {status}
          </span>
        </div>

        {/* transcript */}
        <div
          ref={scrollRef}
          className="max-h-[420px] min-h-[280px] overflow-y-auto p-[clamp(22px,3vw,36px)]"
        >
          {messages.length === 0 ? (
            <div>
              <p className="mb-[26px] mt-0 max-w-[520px] font-display text-d-prompt text-ink-faint [text-wrap:pretty]">
                {ASK.emptyPrompt}
              </p>
              <div className="flex flex-wrap gap-[9px]">
                {ASK.chips.map((c) => (
                  <button
                    key={c}
                    type="button"
                    data-chip
                    onClick={() => ask(c)}
                    className="cursor-pointer border border-chip bg-transparent px-[15px] py-[10px] text-left font-mono text-m-12 tracking-t1 text-ink-secondary transition-colors hover:border-accent hover:text-accent"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div key={i} className="flex gap-4 pb-6">
              <span className={`flex-[0_0_62px] font-mono text-m-10-w font-medium tracking-t6 ${
                m.role === 'user' ? 'text-ink-dim' : 'text-accent'
              }`}>
                {m.role === 'user' ? 'YOU' : 'EV·AI'}
              </span>
              <p className={`m-0 flex-1 whitespace-pre-wrap text-p-msg [text-wrap:pretty] ${
                m.role === 'user' ? 'text-ink-secondary' : 'text-ink-bright'
              }`}>
                {m.content}
              </p>
            </div>
          ))}

          {busy ? (
            <div className="flex gap-4">
              <span className="flex-[0_0_62px] font-mono text-m-10-w font-medium tracking-t6 text-accent">
                EV·AI
              </span>
              <span className="animate-pulse-fast font-mono text-m-13 text-ink-dim">thinking…</span>
            </div>
          ) : null}
        </div>

        {/* input bar */}
        <div className="flex items-stretch border-t border-panel">
          <span aria-hidden className="flex items-center pl-[18px] font-mono text-m-13 font-medium text-accent">
            &rsaquo;
          </span>
          <input
            ref={inputRef}
            disabled={busy}
            aria-label="Ask a question about Eduardo"
            placeholder={ASK.placeholder}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void ask(); } }}
            className="min-w-0 flex-1 border-0 bg-transparent px-[14px] py-[19px] font-mono text-m-14 text-ink outline-none"
          />
          <button
            type="button"
            onClick={() => void ask()}
            disabled={busy}
            className="flex-[0_0_auto] cursor-pointer border-0 bg-accent px-6 font-mono text-m-11 font-medium tracking-t7 text-accent-ink transition-colors hover:bg-ink"
          >
            SEND
          </button>
        </div>
      </Reveal>

      <div className="flex flex-wrap gap-x-7 gap-y-[10px] pt-[14px] font-mono text-m-10-r tracking-t6 text-ink-faint">
        <span>MODEL · GEMINI</span>
        <span>TURNS · {String(turns).padStart(2, '0')}</span>
        <span>LAST · {latency === null ? '—' : `${latency}ms`}</span>
        <span className="ml-auto">CONTEXT LOADED FROM MY OWN NOTES</span>
      </div>
    </section>
  );
}
