import type { Player } from '../types';
import { formatCurrency } from '../utils/currency';
import { getTotalBuyIn } from '../utils/settlement';
import ChipBadge from './ChipBadge';
import { colourForPlayer } from '../utils/playerColour';
import { blockInvalidNumberKeys, roundToTwoDecimals } from '..//utils/inputGuards';
import { blockExcessDecimals } from '../utils/inputGuards';

interface PlayerRowProps {
  player: Player;
  index: number;
  onChangeName: (name: string) => void;
  onChangeBuyIn: (value: number) => void;
  onAddRebuy: () => void;
  onChangeRebuy: (rebuyIndex: number, value: number) => void;
  onRemoveRebuy: (rebuyIndex: number) => void;
  onRemove: () => void;
}

export default function PlayerRow({
  player,
  index,
  onChangeName,
  onChangeBuyIn,
  onAddRebuy,
  onChangeRebuy,
  onRemoveRebuy,
  onRemove,
}: PlayerRowProps) {
  const total = getTotalBuyIn(player);

  return (
    <li className="rounded-2xl border border-line bg-felt-deep/40 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <ChipBadge name={player.name || `Player ${index + 1}`} color={colourForPlayer(player.id)} size="md" />

        <div className="min-w-0 flex-1">
          <label className="block">
            <span className="sr-only">Player {index + 1} name</span>
            <input
              type="text"
              value={player.name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder={`Player ${index + 1}`}
              className="w-full rounded-lg border border-transparent bg-transparent font-display text-lg font-semibold text-card placeholder:text-card/40 focus:border-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            />
          </label>

          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-ink-soft">Buy-in</span>
              <span className="flex items-center gap-1 rounded-lg border border-line bg-felt px-2 py-1.5">
                <span className="text-card/60">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={10000000}
                  step="5"
                  value={player.buyIn === 0 ? '' : player.buyIn}
                  onChange={(e) => onChangeBuyIn(Math.max(0, e.target.valueAsNumber || 0))}
                  onKeyDown={(e) => {
                    blockInvalidNumberKeys(e);
                    blockExcessDecimals(e);
                  }}
                  onBlur={() => onChangeBuyIn(roundToTwoDecimals(player.buyIn))}
                  placeholder="0.00"
                  className="w-24 bg-transparent font-mono text-sm text-card placeholder:text-card/30 focus:outline-none"
                />
              </span>
            </label>

            {player.rebuys.map((rebuy, rIndex) => (
              <label key={rIndex} className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-ink-soft">Rebuy {rIndex + 1}</span>
                <span className="flex items-center gap-1 rounded-lg border border-line bg-felt px-2 py-1.5">
                  <span className="text-card/60">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={10000000}
                    step="5"
                    value={rebuy === 0 ? '' : rebuy}
                    onChange={(e) => onChangeRebuy(rIndex, Math.max(0, e.target.valueAsNumber || 0))}
                    onKeyDown={(e) => {
                      blockInvalidNumberKeys(e);
                      blockExcessDecimals(e);
                    }}
                    onBlur={() => onChangeRebuy(rIndex, roundToTwoDecimals(rebuy))}
                    placeholder="0.00"
                    className="w-20 bg-transparent font-mono text-sm text-card placeholder:text-card/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveRebuy(rIndex)}
                    aria-label={`Remove rebuy ${rIndex + 1}`}
                    className="ml-1 text-card/40 transition hover:text-loss"
                  >
                    ×
                  </button>
                </span>
              </label>
            ))}

            <button
              type="button"
              onClick={onAddRebuy}
              className="rounded-full border border-dashed border-gold/60 px-3 py-1.5 text-xs font-medium text-gold transition hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              + Rebuy
            </button>

            <div className="ml-auto flex flex-col items-end gap-1">
              <span className="text-xs uppercase tracking-wide text-ink-soft">Total in</span>
              <span className="font-mono text-sm font-semibold text-gold">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${player.name || `player ${index + 1}`}`}
          className="rounded-full p-1.5 text-card/40 transition hover:bg-loss/10 hover:text-loss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-loss"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}
