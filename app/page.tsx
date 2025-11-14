import Hero from "@/components/Hero/Hero"
import Style from "@/components/Style/Style"
import PopularCategories from "@/components/PopularCategories/PopularCategories"
import PopularGoods from "@/components/PopularGoods/PopularGoods"
import LastReviews from "@/components/LastReviews/LastReviews"
import { fetchPopularGoods, fetchPopularCategories } from "@/lib/api/mainPageApi"

export default async function Home() {
	let initialCategories, initialPopularGoods

	try {
		const [catsRes, goodsRes] = await Promise.allSettled([
			fetchPopularCategories({ page: 1, limit: 4 }),
			fetchPopularGoods({ page: 1, limit: 6 }),
		])

		initialCategories =
			catsRes.status === "fulfilled"
				? catsRes.value
				: { categories: [], page: 1, limit: 4, totalCategories: 0, totalPages: 1 }

		initialPopularGoods =
			goodsRes.status === "fulfilled" ? goodsRes.value : { items: [], page: 1, limit: 6, total: 0, totalPages: 1 }
	} catch (e) {
		initialCategories = { categories: [], page: 1, limit: 4, totalCategories: 0, totalPages: 1 }
		initialPopularGoods = { items: [], page: 1, limit: 6, total: 0, totalPages: 1 }
	}

	return (
		<>
			<Hero />
			<Style />
			<PopularCategories initialData={initialCategories} />
			<PopularGoods initialData={initialPopularGoods} />
			<LastReviews />
		</>
	)
}
