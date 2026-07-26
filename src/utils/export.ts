import type { Transfer } from '../types';
import type { PlayerTotals } from './settlement';
import { formatCurrencyFromCents } from './currency';

export function buildSettlementText(totals: PlayerTotals[], transfers: Transfer[]): string {
  const lines: string[] = ['Poker settlement', ''];

  lines.push('Player, Buy-in, Cash-out, Profit/Loss');
  for (const t of totals) {
    const net = t.netCents ?? 0;
    lines.push(
      `${t.name || 'Unnamed player'}, ${formatCurrencyFromCents(t.totalBuyInCents)}, ${
        t.cashOutCents === null ? '—' : formatCurrencyFromCents(t.cashOutCents)
      }, ${net >= 0 ? '+' : '-'}${formatCurrencyFromCents(Math.abs(net))}`,
    );
  }

  lines.push('', 'Transfers');
  if (transfers.length === 0) {
    lines.push('Everyone broke even — no transfers needed.');
  } else {
    transfers.forEach((tr, i) => {
      lines.push(`${i + 1}. ${tr.fromName || 'Unnamed'} -> ${tr.toName || 'Unnamed'}: ${formatCurrencyFromCents(tr.amountCents)}`);
    });
  }

  return lines.join('\n');
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildSettlementCsv(totals: PlayerTotals[], transfers: Transfer[]): string {
  const rows: string[] = [];
  rows.push(['Player', 'Total Buy-In', 'Cash-Out', 'Profit/Loss'].map(csvEscape).join(','));

  for (const t of totals) {
    const net = t.netCents ?? 0;
    rows.push(
      [
        t.name || 'Unnamed player',
        formatCurrencyFromCents(t.totalBuyInCents),
        t.cashOutCents === null ? '' : formatCurrencyFromCents(t.cashOutCents),
        `${net >= 0 ? '+' : '-'}${formatCurrencyFromCents(Math.abs(net))}`,
      ]
        .map(csvEscape)
        .join(','),
    );
  }

  rows.push('');
  rows.push(['From', 'To', 'Amount'].map(csvEscape).join(','));
  for (const tr of transfers) {
    rows.push(
      [tr.fromName || 'Unnamed', tr.toName || 'Unnamed', formatCurrencyFromCents(tr.amountCents)].map(csvEscape).join(','),
    );
  }

  return rows.join('\n');
}

export function downloadTextFile(filename: string, contents: string, mimeType = 'text/plain') {
  const blob = new Blob([contents], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
