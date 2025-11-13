"use client";

import css from "./StarBtn.module.css";

type StarBtnProps = {
  value: number;
  active: boolean;
  onClick: (v: number) => void;
  spriteHref?: string;
};

export function StarBtn({
  value,
  active,
  onClick,
  spriteHref = "/sprite.svg",
}: StarBtnProps) {
  const id = active ? "star-filled" : "star";

  return (
    <button
      type="button"
      className={`${css.starBtn} ${active ? css.active : ""}`}
      onClick={() => onClick(value)}
      aria-pressed={active}
      title={`${value} з 5`}
    >
      <svg width="24" height="24" viewBox="0 0 19 18" aria-hidden="true">
        <use href={`${spriteHref}#${id}`} x="1" y="1" width="17" height="16" />
      </svg>
    </button>
  );
}
