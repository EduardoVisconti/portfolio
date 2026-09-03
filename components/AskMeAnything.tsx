'use client';

import { useEffect, useRef, useState } from 'react';
import { ASK } from '@/lib/content';
import { createStreamReader, type StreamEvent } from '@/lib/chat';
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
  // Only real answers go here. Error copy is shown in the transcript but must
  // never be replayed to the model as something the model said - it will build
  // on "come back in an hour" as if it had written it. A half-streamed answer
  // is excluded for the same reason: the model did not finish saying it.
  const sent = useRef<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  // Time to first token, not round-trip time. Once the answer arrives a word at
  // a time, total duration stops being the number the visitor experiences.
  const [ttft, setTtft] = useState<number | null>(null);
  const [turns, setTurns] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Instant, not animated — animated scroll fights the user. Runs on every
  // token now, which is what keeps the newest line in view as the answer grows.
  useEffect(() => {
    const box = scrollRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages, busy]);

  async function ask(question?: string) {
    const text = (question ?? inputRef.current?.value ?? '').trim();
    if (!text || busy) return;
    if (inputRef.current) inputRef.current.value = '';

    const history = sent.current;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setBusy(true);
    // The previous turn's number describes the previous turn. Clearing it means
    // the row reads "—" while the answer is in flight rather than reporting a
    // measurement it has not taken yet.
    setTtft(null);

    const t0 = performance.now();

    let answer = '';        // what the model has said so far
    let painted = false;    // whether the assistant turn exists in the transcript
    let complete = false;   // the stream said `d`, so the answer is whole
    let fallback = ASK.fallback;   // shown only if nothing streamed at all

    // The assistant turn is appended by the first token and rewritten by every
    // one after it. Deciding which outside the updater keeps it correct when
    // React batches several tokens into one render.
    const paint = (content: string) => {
      const replace = painted;
      painted = true;
      setMessages((m) => (replace
        ? [...m.slice(0, -1), { role: 'assistant' as const, content }]
        : [...m, { role: 'assistant' as const, content }]));
    };

    const apply = (events: StreamEvent[]) => {
      for (const event of events) {
        if ('t' in event) {
          if (!painted) {
            setTtft(Math.round(performance.now() - t0));
          }
          answer += event.t;
          paint(answer);
        } else if ('e' in event) {
          // A mid-stream failure cannot carry a status code - that was spent on
          // the first byte - so it arrives as an event instead.
          fallback = ASK.fallback;
        } else {
          complete = true;
        }
      }
    };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: text }] }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        const parser = createStreamReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          // `stream: true` so a multi-byte character split across two reads is
          // held rather than decoded into a replacement character.
          apply(parser.push(decoder.decode(value, { stream: true })));
        }
        apply(parser.flush());
      } else if (res.status === 429) {
        // The guard is doing its job; saying "unreachable" would be a lie. The
        // two limits clear at different times, so they get different answers.
        const data = await res.json().catch(() => null);
        fallback = data?.error === 'daily_limit' ? ASK.dailyLimit : ASK.rateLimited;
      } else if (res.status === 503) {
        fallback = ASK.unconfigured;
      }
    } catch {
      /* keep fallback */
    }

    // Nothing reached the screen, so the fallback copy is the whole answer. If
    // something did, the words already there are real model output and stay -
    // replacing them with an apology would throw away a correct partial answer.
    if (!painted) paint(fallback);

    if (complete && answer) {
      sent.current = [...history, { role: 'user', content: text }, { role: 'assistant', content: answer }];
    }
    setTurns((t) => t + 1);
    setBusy(false);
  }

  // Derived rather than stored: the assistant turn appears with the first token,
  // so a trailing user turn is exactly the window where nothing has arrived yet.
  const awaiting = busy && messages[messages.length - 1]?.role === 'user';
  const status = awaiting
    ? 'GENERATING'
    : busy ? 'STREAMING' : messages.length ? 'READY' : 'IDLE';

  return (
    <section id="ask" className="py-section">
      <div className="mb-[clamp(34px,4vw,52px)]">
        <SectionHeader id="ask" />
      </div>

      <Reveal
        range={24}
        className="mb-[clamp(30px,4vw,44px)] flex flex-wrap items-start gap-x-[clamp(40px,6vw,80px)] gap-y-8"
      >
        <p className="m-0 max-w-[620px] flex-[1_1_380px] font-display text-d-ask font-normal text-ink [text-wrap:pretty]">
          {ASK.headBefore}
          <span className="italic text-accent">{ASK.headAccent}</span>
          {ASK.headAfter}
        </p>
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
          <span className="ml-auto font-mono text-m-10 tracking-t6 text-ink-faint">
            {status}
          </span>
        </div>

        {/* transcript */}
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          // A polite region that mutates on every token would have a screen
          // reader restarting the answer a word at a time. aria-busy is the
          // standard way to say "still writing" - assistive tech holds the
          // announcement until it clears, which is what keeps the live region
          // added for the transcript useful rather than hostile.
          aria-busy={busy}
          aria-label="Conversation"
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

          {awaiting ? (
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
            className="min-w-0 flex-1 border-0 bg-transparent px-[14px] py-[19px] font-mono text-[16px] text-ink outline-none"
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
        <span>TTFT · {ttft === null ? '—' : `${ttft}ms`}</span>
        <span className="ml-auto">CONTEXT LOADED FROM MY OWN NOTES</span>
      </div>
    </section>
  );
}
