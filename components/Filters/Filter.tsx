"use client";

import { AllFilters } from "@/types/filters";
import FilterGroup from "./FilterGroup";
import FilterGroupPrice from "./FilterGroupPrice";
import css from "./Filter.module.css";

type FilterProps = {
  options: AllFilters;
  onClose?: () => void;
  variant?: "sidebar" | "dropdown";
};

export default function Filter({
  options,
  onClose,
  variant = "sidebar",
}: FilterProps) {
  if (!options) return null;

  const { categories = [], genders = [], sizes = [], colors = [] } = options;

  const containerClass =
    variant === "sidebar"
      ? css.filterContainerSidebar
      : css.filterContainerDropdown;

  return (
    <div className={containerClass}>
      <FilterGroup
        title="Усі"
        name="category"
        options={categories.map((c) => ({ value: c._id, label: c.name }))}
        onClose={onClose}
        className={css.groupAll}
        hideInput
      />

      <FilterGroup
        title="Розміри"
        name="size"
        options={sizes.map((s) => ({ value: s, label: s }))}
        onClose={onClose}
        className={css.groupSizes}
        multi
      />

      <FilterGroupPrice />

      <FilterGroup
        title="Колір"
        name="color"
        options={colors.map((c) => ({ value: c, label: c }))}
        onClose={onClose}
        className={css.groupColor}
        hideInput
        variant="pill"
        wrap
      />

      <FilterGroup
        title="Стать"
        name="gender"
        options={genders.map((g) => ({ value: g, label: g }))}
        onClose={onClose}
        className={css.groupGender}
      />
    </div>
  );
}
