// components/Filters/FilterGroup.tsx
"use client";

import FilterItem from "./FilterItem";
import css from "./FilterGroup.module.css";
import Link from "next/link";

type FilterGroupProps = {
  title: string;
  name: string;
  options: { value: string; label: string }[];
  onClose?: () => void;
  className?: string;
  multi?: boolean;
  hideInput?: boolean;
  variant?: "default" | "pill";
  wrap?: boolean;
};

export default function FilterGroup({
  title,
  name,
  options,
  onClose,
  className,
  multi = false,
  hideInput = false,
  variant = "default",
  wrap = false,
}: FilterGroupProps) {
  if (!options?.length) return null;

  const groupClassName = className
    ? `${css.filterGroup} ${className}`
    : css.filterGroup;

  const listClassName = wrap
    ? `${css.filterList} ${css.filterList_wrap}`
    : css.filterList;

  return (
    <section className={groupClassName} aria-label={title}>
      <div className={css.titleBtnContainer}>
        <h4 className={css.filterTitle}>{title}</h4>
        <Link className={css.clear} href="/goods">
          Очистити
        </Link>
      </div>

      <ul className={listClassName}>
        {options.map((opt) => (
          <FilterItem
            key={opt.value}
            name={name}
            value={opt.value}
            label={opt.label}
            onClose={onClose}
            multi={multi}
            hideInput={hideInput}
            variant={variant}
          />
        ))}
      </ul>

      <hr className={css.filterDivider} />
    </section>
  );
}
