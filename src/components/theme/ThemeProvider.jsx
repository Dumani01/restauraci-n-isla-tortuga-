import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

function getInitialTheme() {
  return localStorage.getItem('rc_theme') || 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    document.documentElement.dataset.dashboardTheme = theme;
    localStorage.setItem('rc_theme', theme);
    localStorage.setItem('rc_dashboard_theme', theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, isDark, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) }), [isDark, theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context) return context;
  return { theme: document.documentElement.dataset.theme || 'light', isDark: document.documentElement.dataset.theme === 'dark', toggleTheme: () => {} };
}
