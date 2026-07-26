interface HomeScreenProps {
  onStart: () => void;
}

export default function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="font-display text-3xl font-semibold text-card sm:text-4xl">
          Settle up without the napkin math
        </h1>
        <p className="mx-auto max-w-xl text-sm text-ink-soft sm:text-base">
          Track every buy-in and rebuy as the game happens, enter what everyone cashed out for, and get back the
          fewest possible payments to even the table.
        </p>
      </div>

      <ul className="mx-auto grid max-w-xl gap-3 text-sm text-card/80 sm:grid-cols-3 sm:text-center">
        <li className="rounded-xl border border-line bg-felt-deep/40 px-4 py-3">
          <span className="font-display font-semibold text-gold">1. Buy in</span>
          <p className="mt-1 text-ink-soft">Add players and track rebuys</p>
        </li>
        <li className="rounded-xl border border-line bg-felt-deep/40 px-4 py-3">
          <span className="font-display font-semibold text-gold">2. Cash out</span>
          <p className="mt-1 text-ink-soft">Enter final stacks, get instant validation</p>
        </li>
        <li className="rounded-xl border border-line bg-felt-deep/40 px-4 py-3">
          <span className="font-display font-semibold text-gold">3. Settle up</span>
          <p className="mt-1 text-ink-soft">See the minimum payments needed</p>
        </li>
      </ul>

      <div className="suit-divider rounded-2xl border border-dashed border-line py-14 text-center">
        <p className="font-display text-lg font-semibold text-card">The table is empty</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">
          Add each player who bought into the game to start tracking the session.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="btn-sparkle mt-5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-felt-deep shadow-chip transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}