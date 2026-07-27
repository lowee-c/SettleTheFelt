import { useEffect, useState } from 'react';
import { THEME_KEY } from '../types';

export type Theme = 'felt' | 'day';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = window.localStorage.getItem(THEME_KEY);
      if (stored === 'felt' || stored === 'day') return stored;
      return 'felt';
    } catch {
      return 'felt';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Storage may be unavailable (private browsing, quota exceeded, etc).
      // Theme still applies for the current session via data-theme attribute.
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'felt' ? 'day' : 'felt'));

  return { theme, toggleTheme };
}