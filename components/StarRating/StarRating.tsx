import React from "react";
import css from "./StarRating.module.css";

interface StarRatingProps {
  rate: number;
}

export default function StarRating({ rate }: StarRatingProps) {
  const rating = Number(rate) || 0;
  
  return (
    <div className={css.stars}>
      {Array.from({ length: 5 }, (_, index) => {
        const diff = (rate ?? 0) - index;
        
        if (diff >= 1) {
          // Повна зірка
          return (
            <svg key={index} width="20" height="20" className={css.starFull}>
              <use href="/sprite.svg#star-filled" />
            </svg>
          );
        } else if (diff > 0) {
          // Часткова зірка
          return (
            <span key={index} className={css.starPartialWrapper}>
              <svg width="20" height="20" className={css.starEmpty}>
                <use href="/sprite.svg#star" />
              </svg>
              <span
                className={css.starPartialFill}
                style={{ width: `${diff * 100}%` }}
              >
                <svg width="20" height="20" className={css.starFull}>
                  <use href="/sprite.svg#star-filled" />
                </svg>
              </span>
            </span>
          );
        } else {
          // Порожня зірка
          return (
            <svg key={index} width="20" height="20" className={css.starEmpty}>
              <use href="/sprite.svg#star" />
            </svg>
          );
        }
      })}
    </div>
  );
}