import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be unavailable (private browsing, quota exceeded, etc).
      // The app still works in-memory for the current session.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
