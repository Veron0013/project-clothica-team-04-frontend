'use client';

import { useEffect, useState } from 'react';
import css from './ScrollToTopButton.module.css';

export default function ScrollToTopBtn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frameId: number;

    const checkScroll = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      setVisible(prev => {
        const next = scrollTop > 300;
        return prev === next ? prev : next;
      });

      frameId = window.requestAnimationFrame(checkScroll);
    };

    frameId = window.requestAnimationFrame(checkScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleClick = () => {
    if (typeof window === 'undefined') return;

    // у тебе скролиться body → тягнемо body + html
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const classes = `${css.scrollToTopBtn} ${visible ? css.visible : css.hidden}`;

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      aria-label="Прокрутити нагору"
    >
      <svg
        width="32"
        height="32"
        className={css.scrollUpIcon}
        aria-hidden="true"
      >
        <use href="/sprite.svg#keyboard_arrow_up" />
      </svg>
    </button>
  );
}
