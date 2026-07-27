import type { Player } from '../types';
import { formatCurrency } from '../utils/currency';
import { getTotalBuyIn } from '../utils/settlement';
import PlayerRow from './PlayerRow';

interface PlayerSetupScreenProps {
  players: Player[];
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onChangeName: (id: string, name: string) => void;
  onChangeBuyIn: (id: string, value: number) => void;
  onAddRebuy: (id: string) => void;
  onChangeRebuy: (id: string, rebuyIndex: number, value: number) => void;
  onRemoveRebuy: (id: string, rebuyIndex: number) => void;
  onContinue: () => void;
}

export default function PlayerSetupScreen({
  players,
  onAddPlayer,
  onRemovePlayer,
  onChangeName,
  onChangeBuyIn,
  onAddRebuy,
  onChangeRebuy,
  onRemoveRebuy,
  onContinue,
}: PlayerSetupScreenProps) {
  const totalBuyIn = players.reduce((sum, p) => sum + getTotalBuyIn(p), 0);
  const hasEnoughPlayers = players.length >= 2;
  const allBuyInsEntered = players.every((p) => p.buyIn > 0);
  const canContinue = hasEnoughPlayers && allBuyInsEntered;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-card sm:text-3xl">Who's at the table?</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Add all players, their buy-in, and any rebuys along the way. You can change this at any time.
        </p>
      </div>

      <ul className="space-y-3">
        {players.map((player, index) => (
          <PlayerRow
            key={player.id}
            player={player}
            index={index}
            onChangeName={(name) => onChangeName(player.id, name)}
            onChangeBuyIn={(value) => onChangeBuyIn(player.id, value)}
            onAddRebuy={() => onAddRebuy(player.id)}
            onChangeRebuy={(rebuyIndex, value) => onChangeRebuy(player.id, rebuyIndex, value)}
            onRemoveRebuy={(rebuyIndex) => onRemoveRebuy(player.id, rebuyIndex)}
            onRemove={() => onRemovePlayer(player.id)}
          />
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <button
          type="button"
          onClick={onAddPlayer}
          className="rounded-full border border-gold/60 px-4 py-2 text-sm font-medium text-gold transition hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          + Add player
        </button>

        <div className="flex items-center gap-4">
          <p className="text-sm text-ink-soft">
            Table total <span className="font-mono font-semibold text-card">{formatCurrency(totalBuyIn)}</span>
          </p>
          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-felt-deep shadow-chip transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            End Game → Cash Out
          </button>
        </div>
      </div>

      {players.length === 1 && (
        <p className="text-xs text-ink-soft">You must add at least two players to run a settlement.</p>
      )}

      {hasEnoughPlayers && !allBuyInsEntered && (
        <p className="text-xs text-ink-soft">Every player needs a buy-in amount before you can cash out.</p>
      )}
    </div>
  );
}