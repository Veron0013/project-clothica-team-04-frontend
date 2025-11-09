"use client"

import { GoodsList } from "@/components/GoodsList"
import { getGoods } from "@/lib/api/api"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { PER_PAGE } from "@/lib/vars"
import { GoodsQuery, GoodsResponse } from "@/types/goods"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import styles from "@/components/GoodsList/GoodsList.module.css"

//interface Props ={
//	initialData: GoodsResponse
//}

const ProductsPageClient = () => {
	const [perPage, setPerPage] = useState<number>(PER_PAGE)
	//const router = useRouter()

	const sp = useSearchParams()

	const searchParams: GoodsQuery = {
		perPage,
		page: Number(sp.get("page") ?? 1),
		...Object.fromEntries(sp.entries()),
	} as unknown as GoodsQuery

	const cPage: number = Number(searchParams.page)

	const [currentPage, setCurrentPage] = useState<number>(cPage ? cPage : 1)

	const {
		data,
		//isLoading,
		//error,
	} = useQuery({
		queryKey: ["GoodsByCategories", searchParams, currentPage],
		queryFn: () => fetchQueryData(),
		placeholderData: keepPreviousData,
		refetchOnMount: false,
	})

	const fetchQueryData = async () => {
		const res = await getGoods(searchParams)
		if (!res.goods.length) {
			toastMessage(MyToastType.error, "bad request")
		}
		return res
	}

	const handleClick = () => {
		setPerPage(perPage + 3)
		setCurrentPage(currentPage + 1)
		//const params = new URLSearchParams(searchParams).toString()
		//const params = {perPage: perPage+3,...searchParams}

		//router.push(`/goods?${searchParams}`)
	}
	console.log("data", searchParams, currentPage)

	return (
		<>
			<div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
				{data?.goods && data.goods.length > 0 && <GoodsList items={data.goods} />}
				<button className={styles.cardCta} onClick={handleClick}>
					Детальніше
				</button>
			</div>
		</>
	)
}

export default ProductsPageClient
