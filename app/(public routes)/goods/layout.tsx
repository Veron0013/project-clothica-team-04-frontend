// app/(shop)/layout.tsx
import { ReactNode } from "react"
import FilterPanel from "@/components/Filters/FilterPanel"
import css from "./layout.module.css"
import { getFilterOptions } from "@/lib/api/api"
import { AllFilters } from "@/types/filters"

export default async function GoodsLayout({ children }: { children: ReactNode }) {
	let filters: AllFilters = { categories: [], colors: [], fromPrice: 0, toPrice: 0, genders: [], sizes: [] }

	try {
		const response = await getFilterOptions()
		filters = response
	} catch (error) {
		console.error("Не вдалося завантажити фільтри:", error)
		// можна залогувати в Sentry чи показати fallback UI
	}

	return (
		<div className={css.layout}>
			<FilterPanel filters={filters} />
			<main className={css.layout__main}>{children}</main>
		</div>
	)
}
