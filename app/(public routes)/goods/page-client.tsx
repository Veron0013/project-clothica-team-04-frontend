"use client"

import { GoodsList } from "@/components/GoodsList"
import { getGoods } from "@/lib/api/api"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { CLEAR_FILTERS, PER_PAGE } from "@/lib/vars"
import { Good, GoodsQuery } from "@/types/goods"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { debounce } from "lodash"

import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"
import FilterPanel from "@/components/Filters/FilterPanel"
import Loading from "@/app/loading"
import css from "./page-client.module.css"
import { AllSortData } from "@/types/filters"

const ProductsPageClient = () => {
	const router = useRouter()
	const sp = useSearchParams()
	const pathname = usePathname()

	const [displayedGoods, setDisplayedGoods] = useState<Good[]>([])
	const [dataQty, setDataQty] = useState(0)

	const limit = PER_PAGE
	const initialSearch = sp.get("search") || ""
	const initialSort = (sp.get("sort") as keyof AllSortData) || "price_asc"

	const [searchValue, setSearchValue] = useState(initialSearch)
	const [selectedSort, setSelectedSort] = useState<keyof AllSortData>(initialSort)

	// зберігаємо попередній limit для анімації нових товарів
	const prevLimit = useRef(Number(sp.get("limit")) || limit)

	const searchParams: GoodsQuery = useMemo(
		() => ({
			limit: Number(sp.get("limit")) || limit,
			page: 1,
			...Object.fromEntries(sp.entries()),
		}),
		[sp, limit]
	)

	const { data, isFetching } = useQuery({
		queryKey: ["GoodsByCategories", searchParams],
		queryFn: async () => {
			const res = await getGoods(searchParams)
			if (!res) toastMessage(MyToastType.error, "bad request")
			return res
		},
		refetchOnMount: false,
	})

	useEffect(() => {
		if (!data) return
		const fetchGoods = () => {
			const newItemsCount = data.goods.length - prevLimit.current
			setDataQty(newItemsCount > 0 ? newItemsCount : data.goods.length)

			setDisplayedGoods(data.goods)
			prevLimit.current = data.goods.length
		}
		fetchGoods()
	}, [data])

	useEffect(() => {
		const fetchSearch = () => {
			if (sp.toString() === "") {
				setSearchValue("")
			}
		}
		fetchSearch()
	}, [sp])

	const handleShowMore = () => {
		const nextLimit = Number(searchParams.limit) + 3
		const newParams = new URLSearchParams(sp)
		newParams.set("limit", String(nextLimit))
		router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
	}

	const sortOptions: { value: keyof AllSortData; label: string }[] = [
		{ value: "price_asc", label: "💰 Ціна ↑" },
		{ value: "price_desc", label: "💰 Ціна ↓" },
		{ value: "name_asc", label: "🔤 А→Я" },
		{ value: "name_desc", label: "🔤 Я→А" },
	]

	const debouncedUpdateSearch = useRef(
		debounce((value: string) => {
			const newSp = new URLSearchParams(window.location.search) // актуальні search params
			if (value) newSp.set("search", value)
			else newSp.delete("search")
			newSp.delete("page")

			router.push(`${pathname}?${newSp.toString()}`, { scroll: false })
		}, 300)
	).current

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchValue(value)
		setDisplayedGoods([]) // очищаємо старий список
		debouncedUpdateSearch(value)
	}

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value as keyof AllSortData
		setSelectedSort(value)

		const params = new URLSearchParams(sp.toString())
		params.set("sort", value)
		params.delete("page")
		router.push(`${pathname}?${params.toString()}`, { scroll: false })
	}

	return (
		<section className={css.goods}>
			<h1 className={css.title}>Всі товари</h1>
			<div className={css.layout}>
				<FilterPanel vieved={Math.min(data?.limit || 0, data?.totalGoods || 0)} total={data?.totalGoods || 0} />
				<div className={css.goodsContent}>
					<div className={css.searchWrapper}>
						<input
							type="text"
							placeholder="Пошук товарів..."
							className={css.searchInput}
							value={searchValue}
							onChange={handleSearchChange}
						/>
					</div>
					<div className={css.sortWrapper}>
						<select className={css.sortSelect} value={selectedSort} onChange={handleSortChange}>
							{sortOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					{displayedGoods.length > 0 && <GoodsList items={displayedGoods} dataQty={dataQty} />}

					{isFetching && <Loading />}

					{!isFetching && data && data?.limit < data?.totalGoods && (
						<button className={css.cardCta} onClick={handleShowMore} disabled={isFetching}>
							Показати ще
						</button>
					)}

					{data && data?.totalGoods === 0 && (
						<MessageNoInfo buttonText="Скинути фільтри" text={CLEAR_FILTERS} route="/goods" />
					)}
				</div>
			</div>
		</section>
	)
}

export default ProductsPageClient
