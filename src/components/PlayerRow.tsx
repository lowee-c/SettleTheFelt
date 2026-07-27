import type { Player } from '../types';
import { formatCurrency } from '../utils/currency';
import { getTotalBuyIn } from '../utils/settlement';
import ChipBadge from './ChipBadge';
import { colourForPlayer } from '../utils/playerColour';
import { blockInvalidNumberKeys, roundToTwoDecimals } from '../utils/inputGuards';
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

const STEP = 5;
const MAX = 10000000;

function stepperButtonClass(side: 'left' | 'right') {
  return `flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-card/60 transition hover:bg-felt-deep hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold ${
    side === 'left' ? '-ml-1' : '-mr-1'
  }`;
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
              <span className="flex items-center gap-1 rounded-lg border border-line bg-felt px-1.5 py-1.5">
                <button
                  type="button"
                  onClick={() => onChangeBuyIn(Math.max(0, roundToTwoDecimals(player.buyIn - STEP)))}
                  aria-label="Decrease buy-in"
                  className={stepperButtonClass('left')}
                >
                  −
                </button>
                <span className="text-card/60">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={MAX}
                  step={STEP}
                  value={player.buyIn === 0 ? '' : player.buyIn}
                  onChange={(e) => onChangeBuyIn(Math.max(0, e.target.valueAsNumber || 0))}
                  onKeyDown={(e) => {
                    blockInvalidNumberKeys(e);
                    blockExcessDecimals(e);
                  }}
                  onBlur={() => onChangeBuyIn(roundToTwoDecimals(player.buyIn))}
                  placeholder="0.00"
                  className="w-16 [appearance:textfield] bg-transparent text-center font-mono text-sm text-card placeholder:text-card/30 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => onChangeBuyIn(Math.min(MAX, roundToTwoDecimals(player.buyIn + STEP)))}
                  aria-label="Increase buy-in"
                  className={stepperButtonClass('right')}
                >
                  +
                </button>
              </span>
            </label>

            {player.rebuys.map((rebuy, rIndex) => (
              <label key={rIndex} className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-ink-soft">Rebuy {rIndex + 1}</span>
                <span className="flex items-center gap-1 rounded-lg border border-line bg-felt px-1.5 py-1.5">
                  <button
                    type="button"
                    onClick={() => onChangeRebuy(rIndex, Math.max(0, roundToTwoDecimals(rebuy - STEP)))}
                    aria-label={`Decrease rebuy ${rIndex + 1}`}
                    className={stepperButtonClass('left')}
                  >
                    −
                  </button>
                  <span className="text-card/60">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={MAX}
                    step={STEP}
                    value={rebuy === 0 ? '' : rebuy}
                    onChange={(e) => onChangeRebuy(rIndex, Math.max(0, e.target.valueAsNumber || 0))}
                    onKeyDown={(e) => {
                      blockInvalidNumberKeys(e);
                      blockExcessDecimals(e);
                    }}
                    onBlur={() => onChangeRebuy(rIndex, roundToTwoDecimals(rebuy))}
                    placeholder="0.00"
                    className="w-14 [appearance:textfield] bg-transparent text-center font-mono text-sm text-card placeholder:text-card/30 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => onChangeRebuy(rIndex, Math.min(MAX, roundToTwoDecimals(rebuy + STEP)))}
                    aria-label={`Increase rebuy ${rIndex + 1}`}
                    className={stepperButtonClass('right')}
                  >
                    +
                  </button>
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
              className="rounded-full border border-dashed border-gold/60 px-3 py-1.5 text-xs font-medium text-gold transition hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
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