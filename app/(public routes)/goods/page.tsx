"use server"

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import ProductsPageClient from "./page-client"
import { GoodsQuery } from "@/types/goods"
import FilterPanel from "@/components/Filters/FilterPanel"

interface Props {
	searchParams: Promise<GoodsQuery>
}

const ProductsPage = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient()

	const queryParams = await searchParams

	console.log("params", queryParams)

	return (
		<>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ProductsPageClient />
			</HydrationBoundary>
		</>
	)
}

export default ProductsPage
