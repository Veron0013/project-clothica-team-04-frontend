// components/FilterPanel/FilterPanel.tsx
"use client"

import { useState } from "react"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import Filter from "@/components/Filters/Filter"
import css from "./FilterPanel.module.css"
import { BREAKPOINTS } from "@/lib/vars"
import { AllFilters } from "@/types/filters"

export default function FilterPanel({ filters }: { filters: AllFilters }) {
	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile})`)
	const [isOpen, setIsOpen] = useState(false)

	if (!filters) return null

	return (
		<>
			{!isMobile ? (
				<aside className={css.filterPanel__aside}>
					<Filter options={filters} />
				</aside>
			) : (
				<>
					<button
						type="button"
						className={css.filterPanel__button}
						onClick={() => setIsOpen((s) => !s)}
						aria-expanded={isOpen}
					>
						Фільтри
					</button>

					{isOpen && (
						<div className={css.filterPanel__modal} role="dialog" aria-modal="true">
							<div className={css.filterPanel__modalInner}>
								<Filter options={filters} onClose={() => setIsOpen(false)} />
								<button className={css.filterPanel__close} onClick={() => setIsOpen(false)}>
									Закрити
								</button>
							</div>
						</div>
					)}
				</>
			)}
		</>
	)
}
