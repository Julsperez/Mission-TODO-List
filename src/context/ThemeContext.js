import React from 'react';
import { useAuth } from '../Hooks/useAuth';
import { settingsService } from '../services/settingsService';

const ThemeContext = React.createContext(null);

const VALID_THEMES = ['dark', 'light', 'system'];
const STORAGE_KEY = 'theme';

function applyThemeToDOM(themeValue) {
  const resolved =
    themeValue === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : themeValue;

  if (resolved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function ThemeProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [theme, setThemeState] = React.useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return VALID_THEMES.includes(stored) ? stored : 'dark';
  });

  // Aplicar el tema almacenado en localStorage al DOM en el montaje inicial
  // (evita flash de dark mode cuando el usuario tenía 'light' o 'system' guardado)
  React.useLayoutEffect(() => {
    applyThemeToDOM(theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizar desde servidor cuando el usuario carga/hace login
  React.useEffect(() => {
    const serverTheme = user?.settings?.theme;
    if (serverTheme && VALID_THEMES.includes(serverTheme)) {
      localStorage.setItem(STORAGE_KEY, serverTheme);
      setThemeState(serverTheme);
      applyThemeToDOM(serverTheme);
    }
  }, [user]);

  // Escuchar cambios del OS cuando tema es 'system'
  React.useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyThemeToDOM('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = React.useCallback(
    (newTheme) => {
      if (!VALID_THEMES.includes(newTheme)) return;
      localStorage.setItem(STORAGE_KEY, newTheme);
      setThemeState(newTheme);
      applyThemeToDOM(newTheme);
      if (isAuthenticated) {
        settingsService.updateSettings({ theme: newTheme }).catch(() => {});
      }
    },
    [isAuthenticated]
  );

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };
