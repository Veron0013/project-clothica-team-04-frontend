// components/Filters/FilterGroup.tsx
"use client"

import FilterItem from "./FilterItem"
import css from "./Filter.module.css"

export default function FilterGroup({
	title,
	name,
	options,
	onClose,
}: {
	title: string
	name: string
	options: { value: string; label: string }[]
	onClose?: () => void
}) {
	if (!options?.length) return null

	return (
		<section className={css.filter__group} aria-label={title}>
			<h4 className={css.filter__title}>{title}</h4>
			<ul className={css.filter__list}>
				{options.map((opt) => (
					<FilterItem key={opt.value} name={name} value={opt.value} label={opt.label} onClose={onClose} />
				))}
			</ul>
		</section>
	)
}
