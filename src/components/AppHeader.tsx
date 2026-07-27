import type { Screen } from '../types';
import type { Theme } from '../hooks/useTheme';
import { MoonIcon, SunIcon, NoSymbolIcon, BanknotesIcon, ArrowUpCircleIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';

interface AppHeaderProps {
  screen: Screen;
  theme: Theme;
  onToggleTheme: () => void;
  onNewGame: () => void;
  hasPlayers: boolean;
}

const steps: { id: Screen; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'setup', label: 'Buy in', icon: BanknotesIcon },
  { id: 'cashout', label: 'Cash out', icon: ArrowUpCircleIcon },
  { id: 'settlement', label: 'Settle up', icon: ClipboardDocumentCheckIcon },
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
                className="flex items-center gap-1 rounded-full bg-loss px-3 py-2 text-xs font-medium text-card/80 shadow-chip transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-loss"
              >
                <NoSymbolIcon className="h-4 w-4" />
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1 rounded-full border border-line px-3 py-2 text-xs font-medium text-card/80 transition hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label={theme === 'felt' ? 'Switch to day theme' : 'Switch to felt theme'}
            >
              {theme === 'felt' ? (
                <>
                  <MoonIcon className="h-4 w-4" />
                  Felt
                </>
              ) : (
                <>
                  <SunIcon className="h-4 w-4" />
                  Day
                </>
              )}
            </button>
          </div>
        </div>

        {/* Second row: progress steps, hidden on the home screen since it isn't part of the 3-step sequence */}
        {showProgress && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <nav aria-label="Progress" className="hidden items-center gap-2 sm:flex">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <span
                    key={step.id}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${
                      index === activeIndex
                        ? 'border-gold bg-gold/15 text-gold'
                        : index < activeIndex
                          ? 'border-line text-card/70'
                          : 'border-line text-ink-soft'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {step.label}
                  </span>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}