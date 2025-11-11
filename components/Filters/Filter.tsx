"use client"

import { AllFilters } from "@/types/filters"
import css from "./Filter.module.css"
import FilterGroup from "./FilterGroup"
import FilterGroupPrice from "./FilterGroupPrice"

export default function Filter({ options, onClose }: { options: AllFilters; onClose?: () => void }) {
	if (!options) return null

	const { categories = [], genders = [], sizes = [], colors = [] } = options

	return (
		<div className={css.filter}>
			<FilterGroup
				title="Категорії"
				name="category"
				options={categories.map((c) => ({ value: c._id, label: c.name }))}
				onClose={onClose}
			/>

			<FilterGroup title="Розміри" name="size" options={sizes.map((s) => ({ value: s, label: s }))} onClose={onClose} />

			<FilterGroupPrice />

			<FilterGroup
				title="Стать"
				name="gender"
				options={genders.map((g) => ({ value: g, label: g }))}
				onClose={onClose}
			/>

			<FilterGroup title="Колір" name="color" options={colors.map((c) => ({ value: c, label: c }))} onClose={onClose} />
		</div>
	)
}
