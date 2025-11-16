// components/Filters/FilterItem.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useState } from "react";
import css from "./FilterItem.module.css";

type FilterItemProps = {
  name: string;
  value: string;
  label: string;
  onClose?: () => void;
  multi?: boolean;
  hideInput?: boolean;
  variant?: "default" | "pill"; // 👈 додали
};

export default function FilterItem({
  name,
  value,
  label,
  onClose,
  multi = false,
  hideInput = false,
  variant = "default",
}: FilterItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, setPending] = useState(false);

  const currentValues = multi ? sp.getAll(name) : [sp.get(name) ?? ""];
  const isActive = multi
    ? currentValues.includes(value)
    : sp.get(name) === value;

  const handleChange = () => {
    if (pending) return;

    const next = new URLSearchParams(sp.toString());

    if (multi) {
      const current = next.getAll(name);
      if (isActive) {
        const updated = current.filter((v) => v !== value);
        next.delete(name);
        updated.forEach((v) => next.append(name, v));
      } else {
        next.append(name, value);
      }
    } else {
      if (isActive) {
        next.delete(name);
      } else {
        next.set(name, value);
      }
    }

    next.delete("page");

    const href = `${pathname}${next.toString() ? "?" + next.toString() : ""}`;

    setPending(true);
    startTransition(() => {
      router.push(href);
    });
    setTimeout(() => setPending(false), 1500);

    onClose?.();
  };

  const inputClass = hideInput ? css.filterInputHidden : css.filterInput;

  const linkClassName = [
    css.filterLink,
    variant === "pill" && css.filterLink_pill,
    isActive && css.filterLink_active,
    isActive && variant === "pill" && css.filterLink_pill_active,
    pending && css.filterLink_disabled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={css.filterItem}>
      <label className={css.filterLabel}>
        <input
          type={multi ? "checkbox" : "radio"}
          name={name}
          value={value}
          checked={isActive}
          onChange={handleChange}
          disabled={pending}
          className={inputClass}
        />
        <span className={linkClassName}>{label}</span>
      </label>
    </li>
  );
}
