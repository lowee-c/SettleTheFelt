/** A palette that reads clearly against the felt background and stays distinct from win/loss colors. */
const PLAYER_COLOURS_FELT = [
  '#C9A227', // gold
  '#4F86C6', // blue
  '#B33F84', // magenta
  '#3FB6A8', // teal
  '#DB8A2B', // amber
  '#9B7FD1', // violet
  '#5FA8D3', // sky
  '#D3705F', // clay
  '#7D9A4C', // olive
  '#E0598B', // rose
];

/** Same hues, darkened so they hold contrast against the lighter day-theme card. */
const PLAYER_COLOURS_DAY = [
  '#8A6B0F', // gold
  '#2F5F94', // blue
  '#832A5F', // magenta
  '#25806F', // teal
  '#9C620F', // amber
  '#6B4FA0', // violet
  '#2F73A0', // sky
  '#9C4A38', // clay
  '#526B2E', // olive
  '#A03664', // rose
];

/** Deterministic color per player id, so the same player always gets the same badge color. */
export function colourForPlayer(id: string, theme: 'felt' | 'day' = 'felt'): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const palette = theme === 'day' ? PLAYER_COLOURS_DAY : PLAYER_COLOURS_FELT;
  return palette[hash % palette.length];
}