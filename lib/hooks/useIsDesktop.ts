import { useState, useEffect } from "react";

// Точка перелому, від якої починаємо завантажувати 6 карток
const DESKTOP_BREAKPOINT = 1440;
// Базовий ліміт для менших екранів
const BASE_LIMIT = 4;
// Ліміт для великих екранів
const DESKTOP_LIMIT = 6;

export const useIsDesktop = () => {
  // Використовуємо 0 або undefined як початкове значення для запобігання SSR-помилкам
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        setLimit(DESKTOP_LIMIT); // >= 1440px -> 6 карток
      } else {
        setLimit(BASE_LIMIT); // < 1440px -> 4 картки
      }
    };

    // Встановлюємо початкове значення
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return limit;
};
