"use server"

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import ProductsPageClient from "./page-client"
import { GoodsFilter } from "@/lib/productsServise"
import { getGoods } from "@/lib/api/api"

interface Props {
	searchParams: GoodsFilter
}

const ProductsPage = async ({ searchParams }: Props) => {
	const page = 1
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ["GoodsByCategories", page],
		queryFn: () => getGoods({ perPage: 12, page }),
	})

	//const goods = await getGoods({ perPage: 12, page })

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProductsPageClient />
		</HydrationBoundary>
	)
}

export default ProductsPage
