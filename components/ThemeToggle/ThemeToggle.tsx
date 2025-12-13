'use client';

import { useEffect, useState } from 'react';
import css from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';
const THEME_KEY = 'theme';

export default function TeamTaggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // 1) ініціалізація теми
  useEffect(() => {
    const stored =
      typeof window !== 'undefined'
        ? (localStorage.getItem(THEME_KEY) as Theme | null)
        : null;

    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches;

    const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light');

    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  // 2) синхронізація при зміні
  useEffect(() => {
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  if (!theme) return null;

  const isDark = theme === 'dark';

  const handleToggle = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      type="button"
      className={css.btn}
      onClick={handleToggle}
      aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <svg className={css.icon} width="32" height="32" aria-hidden="true">
        <use href="/sprite.svg#icon-lantern" />
      </svg>
    </button>
  );
}
