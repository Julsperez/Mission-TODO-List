import React from 'react';
import { HiMoon, HiSun, HiDesktopComputer } from 'react-icons/hi';
import { useTheme } from '../../Hooks/useTheme';
import './ThemeToggle.css';

const THEME_CYCLE  = { dark: 'light', light: 'system', system: 'dark' };
const THEME_ICON   = { dark: HiMoon,  light: HiSun,    system: HiDesktopComputer };
const THEME_LABEL  = { dark: 'Tema oscuro', light: 'Tema claro', system: 'Sistema' };
const NEXT_ARIA    = {
  dark:   'Cambiar a tema claro',
  light:  'Cambiar a tema sistema',
  system: 'Cambiar a tema oscuro',
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = THEME_ICON[theme] ?? HiMoon;

  return (
    <button
      className="themeToggle"
      onClick={() => setTheme(THEME_CYCLE[theme])}
      aria-label={NEXT_ARIA[theme]}
      title={THEME_LABEL[theme]}
    >
      <Icon aria-hidden="true" />
      <span className="sr-only">{THEME_LABEL[theme]}</span>
    </button>
  );
}

export { ThemeToggle };
