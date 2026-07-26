import type { Player } from '../types';
import { formatCurrency, formatCurrencyFromCents, fromCents } from '../utils/currency';
import { getTotalBuyIn, validateGame } from '../utils/settlement';
import ChipBadge from './ChipBadge';
import { colourForPlayer } from '../utils/playerColour';

interface CashOutScreenProps {
  players: Player[];
  onChangeCashOut: (id: string, value: number | null) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function CashOutScreen({ players, onChangeCashOut, onBack, onContinue }: CashOutScreenProps) {
  const validation = validateGame(players);
  const diffDollars = fromCents(validation.differenceCents);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-card sm:text-3xl">Count the stacks</h1>
        <p className="mt-1 text-sm text-ink-soft">Enter what each player cashed out for at the end of the game.</p>
      </div>

      <ul className="space-y-3">
        {players.map((player) => {
          const totalBuyIn = getTotalBuyIn(player);
          return (
            <li
              key={player.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-felt-deep/40 p-4 sm:p-5"
            >
              <ChipBadge name={player.name || 'Player'} color={colourForPlayer(player.id)} size="sm" />
              <div className="min-w-[7rem] flex-1">
                <p className="font-display font-semibold text-card">{player.name || 'Unnamed player'}</p>
                <p className="text-xs text-ink-soft">Bought in for {formatCurrency(totalBuyIn)}</p>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-ink-soft">Cash-out</span>
                <span className="flex items-center gap-1 rounded-lg border border-line bg-felt px-2 py-1.5">
                  <span className="text-card/60">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.05"
                    value={player.cashOut === null ? '' : player.cashOut}
                    onChange={(e) => {
                      const raw = e.target.value;
                      onChangeCashOut(player.id, raw === '' ? null : e.target.valueAsNumber);
                    }}
                    placeholder="0.00"
                    className="w-24 bg-transparent font-mono text-sm text-card placeholder:text-card/30 focus:outline-none"
                  />
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="space-y-3 border-t border-line pt-5">
        {!validation.allCashOutsEntered && (
          <p className="text-sm text-ink-soft">Enter a cash-out for every player to check the numbers.</p>
        )}

        {validation.allCashOutsEntered && validation.differenceCents !== 0 && (
          <div className="rounded-xl border border-loss/50 bg-loss/10 px-4 py-3 text-sm text-loss" role="alert">
            <p className="font-semibold">The table doesn't balance.</p>
            <p className="mt-1">
              Cash-outs are {diffDollars > 0 ? 'higher' : 'lower'} than buy-ins by{' '}
              <span className="font-mono">{formatCurrency(Math.abs(diffDollars))}</span>. Recount the stacks and fix
              the amount above before settling up.
            </p>
          </div>
        )}

        {validation.allCashOutsEntered && validation.differenceCents === 0 && (
          <div className="rounded-xl border border-win/50 bg-win/10 px-4 py-3 text-sm text-win" role="status">
            The table balances. Buy-ins and cash-outs both total{' '}
            <span className="font-mono">{formatCurrencyFromCents(validation.totalBuyInCents)}</span>.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium text-card/80 transition hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            ← Back to buy-ins
          </button>
          <button
            type="button"
            disabled={!validation.isValid}
            onClick={onContinue}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-felt-deep shadow-chip transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Settle up →
          </button>
        </div>
      </div>
    </div>
  );
}
