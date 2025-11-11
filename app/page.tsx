import Hero from "@/components/Hero/Hero"
import Style from "@/components/Style/Style"
import PopularCategories from "@/components/PopularCategories/PopularCategories"
import PopularGoods from "@/components/PopularGoods/PopularGoods"
import LastReviews from "@/components/LastReviews/LastReviews"

export default async function Home() {
	// const initialCategories = await fetchPopularCategoriesServer();
	// const initialPopularGoods = await fetchPopularGoodsServer();
	// const initialLastReviews = await fetchLastReviewsServer();

	return (
		<>
			<Hero />
			<Style />
			<PopularCategories />
			<PopularGoods />
			<LastReviews />
		</>
	)
}
