"use client";

import { useEffect, useState } from "react";
import css from "./ThemeToggle.module.css";

type Theme = "light" | "dark";
const THEME_KEY = "theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // 1) початкова тема
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem(THEME_KEY) as Theme | null)
        : null;

    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");

    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  // 2) при зміні теми оновлюємо html + localStorage
  useEffect(() => {
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  if (!theme) return null;

  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      className={`${css.toggle} ${isDark ? css.toggleDark : ""}`}
      onClick={handleToggle}
      aria-label="Перемкнути тему"
      aria-pressed={isDark}
    >
      <div className={css.track}>
        <div className={css.knob} />
      </div>
    </button>
  );
}
