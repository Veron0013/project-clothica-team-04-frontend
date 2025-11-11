"use server"

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import ProductsPageClient from "./page-client"
//import { GoodsFilter } from "@/lib/productsServise"
import { getGoods } from "@/lib/api/api"
import { GoodsQuery } from "@/types/goods"

interface Props {
	searchParams: Promise<GoodsQuery>
}

const ProductsPage = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient()

	const queryParams = await searchParams

	console.log("params", queryParams)

	await queryClient.prefetchQuery({
		queryKey: ["GoodsByCategories", queryParams],
		queryFn: () => getGoods(queryParams),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProductsPageClient />
		</HydrationBoundary>
	)
}

export default ProductsPage
