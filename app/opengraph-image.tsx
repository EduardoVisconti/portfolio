import { ImageResponse } from 'next/og';
import { PALETTE } from '@/lib/palette';

/**
 * The card a LinkedIn post or a recruiter DM renders, which is the dominant way
 * anyone arrives here. Generated at the edge, so there is no binary asset to
 * keep in sync with the page. Deliberately no web font: a font fetch is one
 * more thing that can fail and leave a blank card.
 */
export const alt = 'Eduardo Visconti — AI Engineer, Full-Stack';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: PALETTE.bg,
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', color: PALETTE.accent, fontSize: 24, letterSpacing: '0.18em' }}>
          AI ENGINEER · FULL-STACK
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', color: PALETTE.ink, fontSize: 128, lineHeight: 1, letterSpacing: '-0.04em' }}>
            Eduardo
          </div>
          <div style={{ display: 'flex', color: PALETTE.ink, fontSize: 128, lineHeight: 1, letterSpacing: '-0.04em' }}>
            Visconti
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', height: 1, width: '100%', background: PALETTE.hairline }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', color: PALETTE.prose, fontSize: 27, maxWidth: 760 }}>
              Production systems where an LLM agent is part of the runtime
            </div>
            <div style={{ display: 'flex', color: PALETTE.faint, fontSize: 22, letterSpacing: '0.1em' }}>
              TAMPA, FL
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
