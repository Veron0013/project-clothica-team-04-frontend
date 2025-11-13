"use client"

import { GoodsList } from "@/components/GoodsList"
import { getGoods } from "@/lib/api/api"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { PER_PAGE } from "@/lib/vars"
import { Good, GoodsQuery } from "@/types/goods"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import styles from "@/components/GoodsList/GoodsList.module.css"
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"
import layoutStyle from "./layout.module.css"
import FilterPanel from "@/components/Filters/FilterPanel"

const ProductsPageClient = () => {
	const router = useRouter()
	const sp = useSearchParams()
	const pathname = usePathname()

	const [isAppending, setIsAppending] = useState(false)
	const [limit, setLimit] = useState(PER_PAGE)
	const [displayedGoods, setDisplayedGoods] = useState<Good[]>([])

	const [dataText, setDataText] = useState("")

	const searchParams: GoodsQuery = {
		limit: Number(sp.get("limit")) || limit,
		page: Number(sp.get("page")) || 1,
		...Object.fromEntries(sp.entries()),
	} as GoodsQuery

	const { data, isFetching } = useQuery({
		queryKey: ["GoodsByCategories", searchParams, limit],
		queryFn: async () => {
			const res = await getGoods(searchParams)
			if (!res) toastMessage(MyToastType.error, "bad request")
			return res
		},
		placeholderData: keepPreviousData,
		refetchOnMount: false,
	})

	// коли прийшла нова data
	useEffect(() => {
		if (!data) return
		setIsAppending(true)
		const fetchDisplayedGoods = () => {
			if (isAppending) {
				setDisplayedGoods((prev) => {
					const existingIds = new Set(prev.map((item) => item._id))
					const newGoods = data.goods.filter((item) => !existingIds.has(item._id))
					return [...prev, ...newGoods]
				})
				setIsAppending(false)
			} else {
				setDisplayedGoods(data.goods)
			}
		}
		fetchDisplayedGoods()
		setIsAppending(false)
	}, [data, isAppending])

	//useEffect(() => {
	//	const fetchOrders = async () => {
	//		try {
	//			const ordersData = await getUserOrders()
	//			const ordersDataJson = JSON.stringify(ordersData, null, 2)
	//			setDataText(ordersDataJson)
	//		} catch (err) {
	//			console.error(err)
	//		}
	//	}

	//	fetchOrders()
	//}, [])

	//console.log("d=", displayedGoods, data.goods)

	const handleShowMore = () => {
		setIsAppending(true)
		const nextLimit = Number(searchParams.limit) + 3
		const newParams = new URLSearchParams(sp)
		newParams.set("limit", String(nextLimit))
		router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
	}

	return (
		<div className={layoutStyle.layout}>
			<FilterPanel />
			<div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
				{displayedGoods.length > 0 && <GoodsList items={displayedGoods} />}

				{!isFetching && data && data?.limit < data?.totalGoods && (
					<button
						className={`${styles.cardCta} ${isFetching ? "opacity-50" : ""}`}
						onClick={handleShowMore}
						disabled={isFetching}
					>
						{isFetching ? "Завантаження..." : `Показати ще ${data?.limit} з ${data?.totalGoods}`}
					</button>
				)}

			{/*{!isFetching && displayedGoods?.length === 0 && (*/}
			<MessageNoInfo
					buttonText={CLEAR_FILTERS}
					text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх"
					route="/"
				/>
				<MessageNoInfo
					buttonText={LEAVE_REVIEW_MESSAGE}
					text="У цього товару ще немає відгуків"
					route="/"
				/>
				<MessageNoInfo
					buttonText={BEFORE_SHOPPING_MESSAGE}
					text="Ваш кошик порожній, мершій до покупок!"
					route="/"
				/>
				<MessageNoInfo
					buttonText={GO_TO_SHOPPING}
					text="У вас ще не було жодних замовлень! Мершій до покупок!"
					route="/"
				/>
			{/*)}*/}
		</div>
	)
}

export default ProductsPageClient
