import type { Screen } from '../types';
import type { Theme } from '../hooks/useTheme';

interface AppHeaderProps {
  screen: Screen;
  theme: Theme;
  onToggleTheme: () => void;
  onNewGame: () => void;
  hasPlayers: boolean;
}

const steps: { id: Screen; label: string }[] = [
  { id: 'setup', label: '1 - Buy in' },
  { id: 'cashout', label: '2 - Cash out' },
  { id: 'settlement', label: '3 - Settle up' },
];

export default function AppHeader({ screen, theme, onToggleTheme, onNewGame, hasPlayers }: AppHeaderProps) {
  const activeIndex = steps.findIndex((s) => s.id === screen);
  const showProgress = screen !== 'home';

  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-3xl px-5 py-5 sm:px-8">
        {/* Top row: logo/title on the left, theme toggle pinned top-right */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}favicon.png`} alt="Settle The Felt" className="h-10 w-10" />
            <div>
              <p className="font-display text-xl font-semibold leading-none text-card">Settle The Felt</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-soft">A Poker settlement calculator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasPlayers && screen !== 'home' && (
              <button
                type="button"
                onClick={onNewGame}
                className="rounded-full border border-loss/60 px-3 py-2 text-xs font-medium text-loss transition hover:bg-loss/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-loss"
              >
                New Game
              </button>
            )}

            <button
              type="button"
              onClick={onToggleTheme}
              className="rounded-full border border-line px-3 py-2 text-xs font-medium text-card/80 transition hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label={theme === 'felt' ? 'Switch to day theme' : 'Switch to felt theme'}
            >
              {theme === 'felt' ? '🟢 Felt' : '☀️ Day'}
            </button>
          </div>
        </div>

        {/* Second row: progress steps, hidden on the home screen since it isn't part of the 3-step sequence */}
        {showProgress && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <nav aria-label="Progress" className="hidden items-center gap-2 sm:flex">
              {steps.map((step, index) => (
                <span
                  key={step.id}
                  className={`rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${
                    index === activeIndex
                      ? 'border-gold bg-gold/15 text-gold'
                      : index < activeIndex
                        ? 'border-line text-card/70'
                        : 'border-line text-ink-soft'
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}