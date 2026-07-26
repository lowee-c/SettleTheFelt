/** A palette that reads clearly against the felt background and stays distinct from win/loss colors. */
const PLAYER_COLOURS = [
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

/** Deterministic color per player id, so the same player always gets the same badge color. */
export function colourForPlayer(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PLAYER_COLOURS[hash % PLAYER_COLOURS.length];
}