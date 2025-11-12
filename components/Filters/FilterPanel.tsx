// components/FilterPanel/FilterPanel.tsx
"use client"

import { useEffect, useState } from "react"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import Filter from "@/components/Filters/Filter"
import css from "./FilterPanel.module.css"
import { BREAKPOINTS } from "@/lib/vars"
import { AllFilters } from "@/types/filters"
import { getFilterOptions } from "@/lib/api/api"

export default function FilterPanel() {
	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile})`)
	const [isOpen, setIsOpen] = useState(false)
	const [filters, setFilters] = useState<AllFilters | null>({
		categories: [],
		colors: [],
		fromPrice: 0,
		toPrice: 0,
		genders: [],
		sizes: [],
	})

	useEffect(() => {
		const fetchFilters = async () => {
			try {
				const data = await getFilterOptions()
				setFilters(data)
			} catch (error) {
				console.error("Не вдалося завантажити фільтри:", error)
			}
		}
		fetchFilters()
	}, [])

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
