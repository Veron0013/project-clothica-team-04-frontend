// app/goods/layout.tsx
"use client"

import { useState, useEffect, createContext } from "react"
import { useSearchParams } from "next/navigation"
import Filters from "@/components/Filters/Filter"

export const FiltersContext = createContext(null)

export default function GoodsLayout({ children }: { children: React.ReactNode }) {
	const searchParams = useSearchParams()
	const [filters, setFilters] = useState({})

	useEffect(() => {
		const fetchFilters = async () => {
			const params = Object.fromEntries(searchParams.entries())
			setFilters(params)
		}

		fetchFilters()
	}, [searchParams])

	return (
		<FiltersContext.Provider value={{ filters, setFilters }}>
			<div className="grid grid-cols-[250px_1fr] gap-4 pt-50">
				<aside>
					<Filters />
				</aside>
				<main>{children}</main>
			</div>
		</FiltersContext.Provider>
	)
}
