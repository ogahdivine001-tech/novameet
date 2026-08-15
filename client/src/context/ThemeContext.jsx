import { createContext, useState, useEffect, useCallback } from 'react';
import { THEME_KEY } from '../utils/constants';

export const ThemeContext = createContext(null);

const applyTheme = (theme) => {
  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  const resolved = theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'system';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  const value = { theme, setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
