// components/SortDropdown/SortDropdown.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { AllSortData } from '@/types/filters';
import css from './SortDropdown.module.css';

type SortValue = keyof AllSortData;

type SortOption = {
  value: SortValue;
  label: string;
};

type SortDropdownProps = {
  value: SortValue;
  options: SortOption[];
  onChange: (value: SortValue) => void;
};

export default function SortDropdown({
  value,
  options,
  onChange,
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = options.find(o => o.value === value) ?? options[0];

  const handleSelect = (val: SortValue) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className={css.wrapper}>
      <button
        type="button"
        className={`${css.button} ${open ? css.buttonOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{activeOption.label}</span>

        <svg
          className={`${css.icon} ${open ? css.iconOpen : ''}`}
          width={16}
          height={16}
          aria-hidden="true"
          focusable="false"
        >
          <use href="/sprite.svg#keyboard_arrow_down" />
        </svg>
      </button>

      {open && (
        <ul className={css.list} ref={listRef} role="listbox">
          {options.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                className={`${css.option} ${
                  opt.value === value ? css.optionActive : ''
                }`}
                onClick={() => handleSelect(opt.value)}
                role="option"
                aria-selected={opt.value === value}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
