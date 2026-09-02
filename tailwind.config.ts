import type { Config } from 'tailwindcss';

/**
 * Encodes SPEC-tokens.md. Semantic names only — no raw hex in components.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08090A',
        surface: '#0B0C0E',
        accent: {
          DEFAULT: 'var(--accent, #C7F94A)',
          ink: '#08090A', // text ON accent
        },
        ink: {
          DEFAULT: '#F4F5F6',   // headlines, figures
          bright: '#EAECEE',    // hero lede, assistant body
          mono: '#D6DADE',      // stack items
          secondary: '#C9CDD1', // ledger labels, chips, user body
          prose: '#9AA0A6',     // main reading grey
          muted: '#8A9096',     // nav, supporting copy
          faint: '#767C82',     // indices, footer, telemetry — FLOOR for real text
          idle: '#6E747A',      // rail idle, placeholders
          dim: '#61666C',       // work meta
          label: '#5C6166',     // 10-11px caps labels ONLY
          separator: '#2A2E33', // "/" glyphs, rail tick idle
        },
      },
      // Hairlines: the entire structural system. borderColor + backgroundColor.
      borderColor: {
        grid: 'rgba(255,255,255,.032)',
        soft: 'rgba(255,255,255,.07)',
        panel: 'rgba(255,255,255,.08)',
        rule: 'rgba(255,255,255,.09)',
        hero: 'rgba(255,255,255,.12)',
        strong: 'rgba(255,255,255,.11)',
        hero: 'rgba(255,255,255,.12)',
        field: 'rgba(255,255,255,.13)',
        chip: 'rgba(255,255,255,.14)',
        link: 'rgba(255,255,255,.18)',
        mark: 'rgba(255,255,255,.22)',
      },
      backgroundColor: {
        header: 'rgba(8,9,10,.72)',
        titlebar: 'rgba(255,255,255,.015)',
        rowhover: 'rgba(255,255,255,.022)',
        rule: 'rgba(255,255,255,.09)',
        bartrack: 'rgba(255,255,255,.09)',
        barsource: 'rgba(255,255,255,.14)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        // Display — [size, { lineHeight, letterSpacing }]
        'd-name':    ['clamp(58px,12.4vw,182px)', { lineHeight: '.84',  letterSpacing: '-.035em' }],
        'd-figure':  ['clamp(64px,10.5vw,148px)', { lineHeight: '.82',  letterSpacing: '-.035em' }],
        'd-contact': ['clamp(34px,5vw,68px)',     { lineHeight: '1',    letterSpacing: '-.03em'  }],
        'd-ask':     ['clamp(30px,4.4vw,60px)',   { lineHeight: '1.02', letterSpacing: '-.028em' }],
        'd-ledger':  ['clamp(34px,4vw,56px)',     { lineHeight: '.9',   letterSpacing: '-.03em'  }],
        'd-claim':   ['clamp(26px,3.4vw,44px)',   { lineHeight: '1.08', letterSpacing: '-.022em' }],
        'd-denom':   ['clamp(26px,3.4vw,44px)',   { lineHeight: '1',    letterSpacing: '-.02em'  }],
        'd-project': ['clamp(30px,3.2vw,42px)',   { lineHeight: '1',    letterSpacing: '-.025em' }],
        'd-prompt':  ['clamp(21px,2.4vw,30px)',   { lineHeight: '1.24', letterSpacing: '-.018em' }],
        'd-stat':    ['30px',                     { lineHeight: '1',    letterSpacing: '-.02em'  }],
        // Prose
        'p-lede':    ['clamp(19px,2vw,25px)',     { lineHeight: '1.45', letterSpacing: '-.012em' }],
        'p-intro':   ['clamp(17px,1.7vw,20px)',   { lineHeight: '1.55' }],
        'p-body':    ['16px',                     { lineHeight: '1.6'  }],
        'p-body-l':  ['16px',                     { lineHeight: '1.65' }],
        'p-row':     ['16px',                     { lineHeight: '1.4'  }],
        'p-small':   ['15px',                     { lineHeight: '1.65' }],
        'p-msg':     ['15px',                     { lineHeight: '1.68' }],
        // Mono
        'm-15':      ['15px', { lineHeight: '1.5' }],
        'm-14':      ['14px', { lineHeight: '1'   }],
        'm-13':      ['13px', { lineHeight: '1.5' }],
        'm-12':      ['12px', { lineHeight: '1'   }],
        'm-11':      ['11px', { lineHeight: '1'   }],
        'm-11-r':    ['11px', { lineHeight: '1.6' }],
        'm-10':      ['10px', { lineHeight: '1'   }],
        'm-10-r':    ['10px', { lineHeight: '1.6' }],
        'm-10-w':    ['10px', { lineHeight: '1.9' }],
      },
      letterSpacing: {
        t1: '.04em', t2: '.05em', t3: '.1em',  t4: '.12em',
        t5: '.13em', t6: '.14em', t7: '.16em', t8: '.18em',
        t9: '.2em',  t10: '.22em',
      },
      maxWidth: { container: '1300px' },
      spacing: {
        gutter: 'clamp(20px,4vw,56px)',
        section: 'clamp(80px,11vw,150px)',
        'section-end': 'clamp(60px,7vw,100px)',
        header: '60px',
      },
      transitionTimingFunction: { standard: 'cubic-bezier(.16,1,.3,1)' },
      borderRadius: { none: '0' },
      keyframes: {
        rv:     { from: { opacity: '0', transform: 'translateY(26px)' }, to: { opacity: '1', transform: 'none' } },
        heroIn: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'none' } },
        rvx:    { from: { opacity: '0', transform: 'scaleX(0)' },        to: { opacity: '1', transform: 'scaleX(1)' } },
        fadeIn: { from: { opacity: '0' },                                to: { opacity: '1' } },
        bar:    { from: { transform: 'scaleX(0)' },                      to: { transform: 'scaleX(1)' } },
        prog:   { from: { transform: 'scaleX(0)' },                      to: { transform: 'scaleX(1)' } },
        pulse:  { '0%,100%': { opacity: '1' }, '50%': { opacity: '.22' } },
      },
      animation: {
        pulse: 'pulse 2.4s ease-in-out infinite',
        'pulse-fast': 'pulse 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
