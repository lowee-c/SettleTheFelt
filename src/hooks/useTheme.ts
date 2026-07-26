import { useEffect, useState } from 'react';
import { THEME_KEY } from '../types';

export type Theme = 'felt' | 'day';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'felt' || stored === 'day') return stored;
    return 'felt';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'felt' ? 'day' : 'felt'));

  return { theme, toggleTheme };
}
