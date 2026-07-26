export interface Player {
  id: string;
  name: string;
  /** Initial buy-in, in dollars (decimal). */
  buyIn: number;
  /** Additional rebuy amounts, in dollars (decimal), most recent last. */
  rebuys: number[];
  /** Final cash-out amount, in dollars. Null until entered on the cash-out screen. */
  cashOut: number | null;
}

export type Screen = 'home' | 'setup' | 'cashout' | 'settlement';

export interface Transfer {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  /** Amount in cents. */
  amountCents: number;
}

export interface GameState {
  players: Player[];
  screen: Screen;
}

export const THEME_KEY = 'poker-settlement:theme';
export const GAME_KEY = 'poker-settlement:game';
