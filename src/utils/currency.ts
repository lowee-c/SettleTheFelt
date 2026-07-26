/**
 * All money math happens in integer cents to avoid floating point drift
 * (e.g. 0.1 + 0.2 !== 0.3). Inputs and outputs at the UI boundary are
 * decimal dollars.
 */

export function toCents(dollars: number): number {
  if (!Number.isFinite(dollars)) return 0;
  return Math.round(dollars * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(dollars: number): string {
  return formatter.format(dollars);
}

export function formatCurrencyFromCents(cents: number): string {
  return formatter.format(fromCents(cents));
}

/** Signed version used for profit/loss cells, e.g. "+$150.00" / "-$50.00". */
export function formatSigned(dollars: number): string {
  const abs = formatCurrency(Math.abs(dollars));
  if (dollars > 0) return `+${abs}`;
  if (dollars < 0) return `-${abs}`;
  return abs;
}
