import { useState } from 'react';
import type { GameState, Player, Screen } from './types';
import { GAME_KEY } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { makeId } from './utils/id';
import AppHeader from './components/AppHeader';
import PlayerSetupScreen from './components/PlayerSetupScreen';
import CashOutScreen from './components/CashOutScreen';
import SettlementScreen from './components/SettlementScreen';
import ConfirmDialog from './components/ConfirmDialog';
import HomeScreen from './components/HomeScreen';
const initialState: GameState = { players: [], screen: 'home' };

function newPlayer(): Player {
  return { id: makeId(), name: '', buyIn: 0, rebuys: [], cashOut: null };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [game, setGame] = useLocalStorage<GameState>(GAME_KEY, initialState);
  const [confirmingNewGame, setConfirmingNewGame] = useState(false);

  const players = game.players;
  const screen: Screen = game.screen;

  const setPlayers = (updater: (players: Player[]) => Player[]) => {
    setGame((prev) => ({ ...prev, players: updater(prev.players) }));
  };

  const setScreen = (nextScreen: Screen) => {
    setGame((prev) => ({ ...prev, screen: nextScreen }));
  };

  const handleAddPlayer = () => setPlayers((prev) => [...prev, newPlayer()]);

  const handleRemovePlayer = (id: string) =>
    setGame((prev) => {
      const nextPlayers = prev.players.filter((p) => p.id !== id);
      return {
        ...prev,
        players: nextPlayers,
        screen: nextPlayers.length === 0 ? 'home' : prev.screen,
      };
    });

  const handleChangeName = (id: string, name: string) =>
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));

  const handleChangeBuyIn = (id: string, value: number) =>
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, buyIn: value } : p)));

  const handleAddRebuy = (id: string) =>
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, rebuys: [...p.rebuys, 0] } : p)));

  const handleChangeRebuy = (id: string, rebuyIndex: number, value: number) =>
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rebuys: p.rebuys.map((r, i) => (i === rebuyIndex ? value : r)) } : p,
      ),
    );

  const handleRemoveRebuy = (id: string, rebuyIndex: number) =>
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rebuys: p.rebuys.filter((_, i) => i !== rebuyIndex) } : p)),
    );

  const handleChangeCashOut = (id: string, value: number | null) =>
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, cashOut: value } : p)));

  const handleRequestNewGame = () => setConfirmingNewGame(true);

  const handleConfirmNewGame = () => {
    setGame(initialState);
    setConfirmingNewGame(false);
  };

  return (
    <div className="felt-texture min-h-screen">
      <AppHeader
        screen={screen}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNewGame={handleRequestNewGame}
        hasPlayers={players.length > 0}
      />

      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        {screen === 'home' && (
          <HomeScreen
            onStart={() => {
              if (players.length === 0) {
                handleAddPlayer();
              }
              setScreen('setup');
            }}
          />
        )}

        {screen === 'setup' && (
          <PlayerSetupScreen
            players={players}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            onChangeName={handleChangeName}
            onChangeBuyIn={handleChangeBuyIn}
            onAddRebuy={handleAddRebuy}
            onChangeRebuy={handleChangeRebuy}
            onRemoveRebuy={handleRemoveRebuy}
            onContinue={() => setScreen('cashout')}
          />
        )}

        {screen === 'cashout' && (
          <CashOutScreen
            players={players}
            onChangeCashOut={handleChangeCashOut}
            onBack={() => setScreen('setup')}
            onContinue={() => setScreen('settlement')}
          />
        )}

        {screen === 'settlement' && <SettlementScreen players={players} onBack={() => setScreen('cashout')} />}
      </main>

      <footer className="no-print mx-auto max-w-3xl px-5 pb-10 text-center text-xs text-ink-soft sm:px-8">
        <p>Game data is saved automatically in your browser's cache.</p>
        <p className="mt-2 text-ink-soft/70">
            Developed by{' '}
            <a
              href="https://github.com/lowee-c"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-card/80 transition hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              lowee-c
            </a>
          </p>
      </footer>

      <ConfirmDialog
        open={confirmingNewGame}
        title="Are you sure?"
        description="This will clear all the data from the current session. This cannot be undone."
        confirmLabel="Start new game"
        onConfirm={handleConfirmNewGame}
        onCancel={() => setConfirmingNewGame(false)}
      />
    </div>
  );
}