import type { PlayerTotals } from '../utils/settlement';
import { formatCurrencyFromCents, formatSigned, fromCents } from '../utils/currency';

interface SummaryTableProps {
  totals: PlayerTotals[];
}

export default function SummaryTable({ totals }: SummaryTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-felt-deep/40 text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="px-4 py-3 font-medium">Player</th>
            <th className="px-4 py-3 text-right font-medium">Total buy-in</th>
            <th className="px-4 py-3 text-right font-medium">Cash-out</th>
            <th className="px-4 py-3 text-right font-medium">Profit / loss</th>
          </tr>
        </thead>
        <tbody>
          {totals.map((t) => {
            const net = t.netCents ?? 0;
            const netClass = net > 0 ? 'text-win' : net < 0 ? 'text-loss' : 'text-card/70';
            return (
              <tr key={t.id} className="border-b border-line/60 last:border-b-0">
                <td className="px-4 py-3 font-display font-medium text-card">{t.name || 'Unnamed player'}</td>
                <td className="px-4 py-3 text-right font-mono text-card/80">
                  {formatCurrencyFromCents(t.totalBuyInCents)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-card/80">
                  {t.cashOutCents === null ? '—' : formatCurrencyFromCents(t.cashOutCents)}
                </td>
                <td className={`px-4 py-3 text-right font-mono font-semibold ${netClass}`}>
                  {t.netCents === null ? '—' : formatSigned(fromCents(t.netCents))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
