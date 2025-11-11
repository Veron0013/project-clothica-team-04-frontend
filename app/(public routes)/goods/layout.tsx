// app/(shop)/layout.tsx
import { ReactNode } from "react"
import FilterPanel from "@/components/Filters/FilterPanel"
import css from "./layout.module.css"
import { getFilterOptions } from "@/lib/api/api"

export default async function GoodsLayout({ children }: { children: ReactNode }) {
	const filters = await getFilterOptions()

	return (
		<div className={css.layout}>
			<FilterPanel filters={filters} />
			<main className={css.layout__main}>{children}</main>
		</div>
	)
}
