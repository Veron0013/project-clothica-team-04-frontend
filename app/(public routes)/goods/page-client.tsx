"use client"

import { GoodsList } from "@/components/GoodsList"
import { getGoods } from "@/lib/api/api"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { PER_PAGE } from "@/lib/vars"
import { Good, GoodsQuery, GoodsResponse } from "@/types/goods"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import styles from "@/components/GoodsList/GoodsList.module.css"
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"

const ProductsPageClient = () => {
	const router = useRouter()
	const sp = useSearchParams()
	const pathname = usePathname()

	const [isAppending, setIsAppending] = useState(false)
	const [perPage, setPerPage] = useState(PER_PAGE)
	const [displayedGoods, setDisplayedGoods] = useState<Good[]>([])

	const searchParams: GoodsQuery = {
		perPage: Number(sp.get("perPage")) || perPage,
		page: Number(sp.get("page")) || 1,
		...Object.fromEntries(sp.entries()),
	} as GoodsQuery

	const { data, isFetching } = useQuery({
		queryKey: ["GoodsByCategories", searchParams, perPage],
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
	}, [data, isAppending])

	//console.log("d=", displayedGoods, data.goods)

	const handleShowMore = () => {
		setIsAppending(true)
		const nextPerPage = Number(searchParams.perPage) + 3
		const newParams = new URLSearchParams(sp)
		newParams.set("perPage", String(nextPerPage))
		router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
	}

	return (
		<div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
			{displayedGoods.length > 0 && <GoodsList items={displayedGoods} />}

			{!isFetching && data && data?.perPage < data?.totalGoods && (
				<button
					className={`${styles.cardCta} ${isFetching ? "opacity-50" : ""}`}
					onClick={handleShowMore}
					disabled={isFetching}
				>
					{isFetching ? "Завантаження..." : `Показати ще ${data?.perPage} з ${data?.totalGoods}`}
				</button>
			)}

			{/*{!isFetching && displayedGoods?.length === 0 && (*/}
			<MessageNoInfo
				buttonText="go home"
				text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх"
				route="/"
			/>
			{/*)}*/}
		</div>
	)
}

export default ProductsPageClient
