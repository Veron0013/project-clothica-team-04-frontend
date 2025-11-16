"use client"

import { GoodsList } from "@/components/GoodsList"
import { getGoods } from "@/lib/api/api"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { CLEAR_FILTERS, PER_PAGE } from "@/lib/vars"
import { Good, GoodsQuery } from "@/types/goods"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"
import css from "./page-client.module.css"
import FilterPanel from "@/components/Filters/FilterPanel"
import Loading from "@/app/loading"

const ProductsPageClient = () => {
	const router = useRouter()
	const sp = useSearchParams()
	const pathname = usePathname()

	const [isAppending, setIsAppending] = useState(false)
	const [limit, setLimit] = useState(PER_PAGE)
	const [displayedGoods, setDisplayedGoods] = useState<Good[]>([])

	const [dataQty, setDataQty] = useState(0)

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
	//useEffect(() => {
	//	if (!data) return
	//	setIsAppending(true)
	//	const fetchDisplayedGoods = () => {
	//		if (isAppending) {
	//			setDisplayedGoods((prev) => {
	//				const existingIds = new Set(prev.map((item) => item._id))
	//				const newGoods = data.goods.filter((item) => !existingIds.has(item._id))
	//				setDataQty(newGoods.length ?? 0)
	//				return [...prev, ...newGoods]
	//			})
	//			setIsAppending(false)
	//		} else {
	//			setDisplayedGoods(data.goods)
	//		}
	//	}
	//	fetchDisplayedGoods()
	//	setIsAppending(false)
	//}, [data, isAppending])

	useEffect(() => {
		if (!data) return
		const fetchDisplayedGoods = () => {
			setDisplayedGoods((prev) => {
				const existingIds = new Set(data.goods.map((i) => i._id))
				const filteredPrev = prev.filter((i) => existingIds.has(i._id))

				const newGoods = data.goods.filter((i) => !filteredPrev.some((p) => p._id === i._id))
				setDataQty(newGoods.length)
				return [...filteredPrev, ...newGoods]
			})
		}
		fetchDisplayedGoods()
	}, [data])

	const handleShowMore = () => {
		setIsAppending(true)
		const nextLimit = Number(searchParams.limit) + 3
		const newParams = new URLSearchParams(sp)
		newParams.set("limit", String(nextLimit))
		router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
	}

	return (
		<>
			<section className={css.goods}>
				<h1 className={css.title}>Всі товари</h1>

				<div className={css.layout}>
					<FilterPanel vieved={Math.min(data?.limit || 0, data?.totalGoods || 0)} total={data?.totalGoods || 0} />

					<div className={css.goodsContent}>
						{displayedGoods.length > 0 && <GoodsList items={displayedGoods} dataQty={dataQty} />}

						{isFetching && <Loading />}

						{!isFetching && data && data?.limit < data?.totalGoods && (
							<button className={css.cardCta} onClick={handleShowMore} disabled={isFetching}>
								{isFetching ? "Завантаження..." : `Показати ще `}
							</button>
						)}

						{data && data?.totalGoods === 0 && (
							<MessageNoInfo buttonText="Скинути фільтри" text={CLEAR_FILTERS} route="/goods" />
						)}
					</div>
				</div>
			</section>
		</>
	)
}

export default ProductsPageClient
