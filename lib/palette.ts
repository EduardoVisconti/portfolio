/**
 * The raw color values, in one place.
 *
 * tailwind.config.ts builds the utility palette from these, and the Open Graph
 * card imports them directly - satori renders inline styles and cannot resolve
 * a Tailwind class. Without this file the OG card was a second, silent copy of
 * the palette, which is exactly what CONTRIBUTING promises does not exist.
 */
export const PALETTE = {
  bg: '#08090A',
  surface: '#0B0C0E',
  accent: '#C7F94A',
  ink: '#F4F5F6',
  prose: '#9AA0A6',
  faint: '#767C82',
  hairline: 'rgba(255,255,255,.12)',
} as const;
