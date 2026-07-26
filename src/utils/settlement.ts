import type { Player, Transfer } from '../types';
import { toCents } from './currency';

export interface PlayerTotals {
  id: string;
  name: string;
  /** Buy-in + all rebuys, in cents. */
  totalBuyInCents: number;
  /** Final cash-out, in cents. Null if not entered yet. */
  cashOutCents: number | null;
  /** cashOut - totalBuyIn, in cents. Null if cash-out not entered yet. */
  netCents: number | null;
}

export function getTotalBuyIn(player: Player): number {
  return player.buyIn + player.rebuys.reduce((sum, r) => sum + r, 0);
}

export function computeTotals(players: Player[]): PlayerTotals[] {
  return players.map((p) => {
    const totalBuyInCents = toCents(getTotalBuyIn(p));
    const cashOutCents = p.cashOut === null ? null : toCents(p.cashOut);
    const netCents = cashOutCents === null ? null : cashOutCents - totalBuyInCents;
    return { id: p.id, name: p.name, totalBuyInCents, cashOutCents, netCents };
  });
}

export interface ValidationResult {
  isValid: boolean;
  allCashOutsEntered: boolean;
  totalBuyInCents: number;
  totalCashOutCents: number;
  differenceCents: number;
}

export function validateGame(players: Player[]): ValidationResult {
  const totals = computeTotals(players);
  const allCashOutsEntered = totals.every((t) => t.cashOutCents !== null);
  const totalBuyInCents = totals.reduce((s, t) => s + t.totalBuyInCents, 0);
  const totalCashOutCents = totals.reduce((s, t) => s + (t.cashOutCents ?? 0), 0);
  const differenceCents = totalCashOutCents - totalBuyInCents;
  return {
    isValid: allCashOutsEntered && differenceCents === 0,
    allCashOutsEntered,
    totalBuyInCents,
    totalCashOutCents,
    differenceCents,
  };
}

/**
 * Greedy largest-balance matching: repeatedly settle the biggest creditor
 * against the biggest debtor. This is the standard practical approach to
 * the "minimum cash flow" problem and always produces at most n-1 transfers
 * for n players (often fewer).
 */
export function computeSettlement(players: Player[]): { transfers: Transfer[]; totalCents: number } {
  const totals = computeTotals(players).filter((t): t is PlayerTotals & { netCents: number } => t.netCents !== null);

  const creditors = totals
    .filter((t) => t.netCents > 0)
    .map((t) => ({ id: t.id, name: t.name, amount: t.netCents }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = totals
    .filter((t) => t.netCents < 0)
    .map((t) => ({ id: t.id, name: t.name, amount: -t.netCents }))
    .sort((a, b) => b.amount - a.amount);

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0) {
      transfers.push({
        fromId: debtor.id,
        fromName: debtor.name,
        toId: creditor.id,
        toName: creditor.name,
        amountCents: amount,
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) i += 1;
    if (creditor.amount === 0) j += 1;
  }

  const totalCents = transfers.reduce((s, t) => s + t.amountCents, 0);
  return { transfers, totalCents };
}
