'use client';

import { AllFilters } from '@/types/filters';
import FilterGroup from './FilterGroup';
import FilterGroupPrice from './FilterGroupPrice';
import css from './Filter.module.css';
import { GENDER_OPTIONS } from '@/lib/vars';

type FilterProps = {
  options: AllFilters;
  onClose?: () => void;
  variant?: 'sidebar' | 'dropdown';
};

export default function Filter({
  options,

  variant = 'sidebar',
}: FilterProps) {
  if (!options) return null;

  const {
    categories = [],
    //genders = [],
    sizes = [],
    //colors = [],
    fromPrice = 1,
    toPrice = 10000,
  } = options;

  const containerClass =
    variant === 'sidebar'
      ? css.filterContainerSidebar
      : css.filterContainerDropdown;

  return (
    <div className={containerClass}>
      <FilterGroup
        title="Усі"
        name="category"
        options={categories.map(c => ({ value: c._id, label: c.name }))}
        className={css.groupAll}
        hideInput
      />

      <FilterGroup
        title="Розміри"
        name="sizes"
        options={sizes.map(s => ({ value: s, label: s }))}
        className={css.groupSizes}
        multi
      />

      <FilterGroupPrice MIN={fromPrice} MAX={toPrice} />

      {/*<FilterGroup
				title="Колір"
				name="color"
				options={colors.map((c) => ({ value: c, label: c }))}
				onClose={onClose}
				className={css.groupColor}
				hideInput
				variant="pill"
				wrap
			/>*/}

      <FilterGroup
        title="Стать"
        name="gender"
        options={GENDER_OPTIONS}
        className={css.groupGender}
      />
    </div>
  );
}
