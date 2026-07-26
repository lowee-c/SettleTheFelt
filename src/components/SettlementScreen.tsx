import { useMemo, useState } from 'react';
import type { Player } from '../types';
import { computeSettlement, computeTotals } from '../utils/settlement';
import { formatCurrencyFromCents } from '../utils/currency';
import { buildSettlementCsv, buildSettlementText, downloadTextFile } from '../utils/export';
import SummaryTable from './SummaryTable';
import TransferList from './TransferList';

interface SettlementScreenProps {
  players: Player[];
  onBack: () => void;
}

export default function SettlementScreen({ players, onBack }: SettlementScreenProps) {
  const [copied, setCopied] = useState(false);
  const totals = useMemo(() => computeTotals(players), [players]);
  const { transfers, totalCents } = useMemo(() => computeSettlement(players), [players]);

  const handleCopy = async () => {
    const text = buildSettlementText(totals, transfers);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      downloadTextFile('poker-settlement.txt', text);
    }
  };

  const handleExportCsv = () => {
    const csv = buildSettlementCsv(totals, transfers);
    downloadTextFile('poker-settlement.csv', csv, 'text/csv');
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-card sm:text-3xl">Settle Up</h1>
          <p className="mt-1 text-sm text-ink-soft">Game Over</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-card/80 transition hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          ← Edit cash-outs
        </button>
      </div>

      <section aria-labelledby="summary-heading" className="space-y-3">
        <h2 id="summary-heading" className="font-display text-lg font-semibold text-card">
          Game Summary
        </h2>
        <SummaryTable totals={totals} />
      </section>

      <section aria-labelledby="transfers-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="transfers-heading" className="font-display text-lg font-semibold text-card">
            Payments
          </h2>
          <p className="text-sm text-ink-soft">
            <span className="font-mono font-semibold text-card">{transfers.length}</span>{' '}
            {transfers.length === 1 ? 'transfer' : 'transfers'} ·{' '}
            <span className="font-mono font-semibold text-card">{formatCurrencyFromCents(totalCents)}</span>{' '}
            exchanged
          </p>
        </div>
        <TransferList transfers={transfers} />
      </section>

      <div className="no-print flex flex-wrap gap-2 border-t border-line pt-5">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-gold/60 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {copied ? 'Copied ✓' : 'Copy results'}
        </button>
        <button
          type="button"
          onClick={handleExportCsv}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-card/80 transition hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-card/80 transition hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Print
        </button>
      </div>
    </div>
  );
}
