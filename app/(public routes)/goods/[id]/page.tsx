import { notFound } from "next/navigation"
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getGoodByIdServer, getFeedbackByGoodIdServer } from "@/lib/api/productsServer"
import GoodPageClient from "@/components/GoodPage/GoodPage"
import { REVIEWS_PER_LOAD } from "@/lib/vars"
import { Good } from "@/types/goods"
import { Metadata } from "next"

type GoodPageProps = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ reviewsPage?: string }>
}
export async function generateMetadata({ params }: GoodPageProps): Promise<Metadata> {
  const {id: productId} = await params;
  try {
		const good: Good = await getGoodByIdServer(productId)

		const price = `${good.price} ${good.currency || '₴'}`
		
		// Обробка зображень для OpenGraph
		const imageUrls = Array.isArray(good.image)
			? good.image.map(img => (typeof img === "object" && 'url' in img ? img.url : img))
			: (good.image ? [good.image] : [])
		
		// Створення короткого опису (якщо він є)
		const descriptionText = good.prevDescription || "Опис товару"

		return {
			title: good?.name ? `${good.name} за ціною ${price} | Clothica` : "Товар | Clothica",
			description: descriptionText,
			
			openGraph: {
				title: good?.name || "Товар",
				description: descriptionText,
				// Використовуємо перше зображення, якщо воно є
				images: imageUrls.length > 0 ? [{ url: imageUrls[0], width: 800, height: 600, alt: good.name }] : [],
			},
		}
	} catch (error) {
		console.error("Error generating metadata (API failed with 400/404):", error)
		
		// При помилці API (400, 404, 500) повертаємо стандартні метадані
		return {
			title: "Товар не знайдено | Clothica",
			description: "Товар не знайдено в каталозі",
		}
	}
}

export default async function Page({ params, searchParams }: GoodPageProps) {
	const { id } = await params
	const searchParamsData = await searchParams

	if (!id) notFound()

	const reviewsPage = parseInt(searchParamsData?.reviewsPage || "1")
	const validReviewsPage = Math.max(1, reviewsPage)

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				gcTime: 5 * 60 * 1000,
				retry: 1,
				refetchOnWindowFocus: false,
			},
		},
	})

	try {
		await Promise.all([
			queryClient.fetchQuery({
				queryKey: ["good", id],
				queryFn: () => getGoodByIdServer(id),
			}),
			queryClient.fetchQuery({
				queryKey: ["goodReviews", id, validReviewsPage],
				queryFn: () => getFeedbackByGoodIdServer(id, validReviewsPage, REVIEWS_PER_LOAD),
			}),
		])

		//const goodState = queryClient.getQueryState(["good", id])
		//if (goodState?.status !== "error") {
		//	throw goodState?.error
		//}
	} catch (error) {
		console.log("Error loading product data:", error)

		//if (error?.response?.status === 404 || error?.status === 404) {
		//	notFound()
		//}

		//if (error?.response?.status >= 500 || error?.status >= 500) {
		//	return (
		//		<div style={{ color: "red", textAlign: "center", padding: "50px" }}>
		//			На жаль, виникла помилка при завантаженні даних.
		//		</div>
		//	)
		//}
	}
	const dehydratedState = dehydrate(queryClient)

	return (
		<HydrationBoundary state={dehydratedState}>
			<GoodPageClient goodId={id} reviewsPerPage={REVIEWS_PER_LOAD} />
		</HydrationBoundary>
	)
}
