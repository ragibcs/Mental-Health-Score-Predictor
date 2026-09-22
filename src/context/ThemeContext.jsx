import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ThemeContext = createContext(null);

export const THEME_STORAGE_KEY = 'mh_theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
}

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(resolved) {
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  root.style.colorScheme = resolved;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? '#0B0D16' : '#F6F6FB');
  }
}

export function ThemeProvider({ children }) {
  // `preference` is what the user picked; `resolved` is what actually renders.
  const [preference, setPreference] = useState(() => getStoredTheme() || 'system');
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme = preference === 'system' ? systemTheme : preference;

  // React to the OS switching between light and dark while the app is open.
  useEffect(() => {
    if (!window.matchMedia) return undefined;

    const mql = window.matchMedia(MEDIA_QUERY);
    const handleChange = (event) => setSystemTheme(event.matches ? 'dark' : 'light');

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next) => {
    setPreference(next);
    try {
      if (next === 'system') {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    } catch {
      // Storage unavailable (private mode) — the in-memory state still works.
    }
  }, []);

  // Light -> dark -> system -> light
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({ theme: resolvedTheme, preference, systemTheme, resolvedTheme, setTheme, toggleTheme }),
    [resolvedTheme, preference, systemTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
