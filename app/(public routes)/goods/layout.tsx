"use client"

import { createContext, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Filters from "@/components/Filters/Filter"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import css from "./layout.module.css"
import { BREAKPOINTS } from "@/lib/vars"

export const FiltersContext = createContext<{
	filters: Record<string, string>
	setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>
} | null>(null)

export default function GoodsLayout({ children }: { children: React.ReactNode }) {
	const sp = useSearchParams()
	const [filters, setFilters] = useState<Record<string, string>>({})
	const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile})`)

	useEffect(() => {
		const fetchFilters = async () => {
			const params = Object.fromEntries(sp.entries())
			setFilters((prev) => {
				if (JSON.stringify(prev) !== JSON.stringify(params)) return params
				return prev
			})
		}
		fetchFilters()
	}, [sp])

	console.log("mob", isMobile)

	return (
		<FiltersContext.Provider value={{ filters, setFilters }}>
			<div className={css.layout}>
				{!isMobile ? (
					<aside className={css.layout__aside}>
						<Filters />
					</aside>
				) : (
					<button type="button" className={css.layout__filterButton}>
						Фільтри
					</button>
				)}
				<main className={css.layout__main}>{children}</main>
			</div>
		</FiltersContext.Provider>
	)
}
