interface EmptyStateProps {
  onAddPlayer: () => void;
}

export default function EmptyState({ onAddPlayer }: EmptyStateProps) {
  return (
    <div className="suit-divider rounded-2xl border border-dashed border-line py-14 text-center">
      <p className="font-display text-lg font-semibold text-card">The table is empty</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">
        Add each player who bought into the game to start tracking the session.
      </p>
      <button
        type="button"
        onClick={onAddPlayer}
        className="btn-sparkle mt-5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-felt-deep shadow-chip transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Start Game
      </button>
    </div>
  );
}
