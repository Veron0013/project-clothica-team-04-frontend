// app/categories/page.tsx
import { getCategories } from "@/lib/api/api"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import CategoriesPage from "./page-client"

export default async function Page() {
	const queryClient = new QueryClient()

	const initialPage = 1
	const limit = 6

	await queryClient.prefetchQuery({
		queryKey: ["categories", initialPage, limit],
		queryFn: () => getCategories(initialPage, limit),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CategoriesPage initialPage={initialPage} limit={limit} />
		</HydrationBoundary>
	)
}
