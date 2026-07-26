import type { Transfer } from '../types';
import { formatCurrencyFromCents } from '../utils/currency';
import ChipBadge from './ChipBadge';

interface TransferListProps {
  transfers: Transfer[];
}

export default function TransferList({ transfers }: TransferListProps) {
  if (transfers.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-ink-soft">
        Everyone broke even - no money needs to change hands.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {transfers.map((t, index) => (
        <li
          key={`${t.fromId}-${t.toId}-${index}`}
          className="flex items-center gap-3 rounded-xl border border-line bg-felt-deep/40 px-4 py-3"
        >
          <span className="w-5 shrink-0 font-mono text-xs text-ink-soft">{index + 1}.</span>
          <ChipBadge name={t.fromName || 'Player'} tone="loss" size="sm" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-card">{t.fromName || 'Unnamed'}</span>

          <svg width="28" height="14" viewBox="0 0 28 14" aria-hidden="true" className="shrink-0 text-gold">
            <line x1="0" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M20 2 L26 7 L20 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>

          <span className="min-w-0 flex-1 truncate text-right text-sm font-medium text-card">
            {t.toName || 'Unnamed'}
          </span>
          <ChipBadge name={t.toName || 'Player'} tone="win" size="sm" />

          <span className="ml-2 w-24 shrink-0 text-right font-mono text-sm font-semibold text-gold">
            {formatCurrencyFromCents(t.amountCents)}
          </span>
        </li>
      ))}
    </ol>
  );
}
