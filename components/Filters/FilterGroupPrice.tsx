"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import css from "./FilterGroupPrice.module.css"

export default function FilterGroupPrice() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const initialMin = Number(searchParams.get("fromPrice")) || 1
	const initialMax = Number(searchParams.get("toPrice")) || 50000

	const [minPrice, setMinPrice] = useState(initialMin)
	const [maxPrice, setMaxPrice] = useState(initialMax)

	useEffect(() => {
		const fetchPrice = () => {
			setMinPrice(initialMin)
			setMaxPrice(initialMax)
		}

		fetchPrice()
	}, [initialMin, initialMax])

	const handleChange = (key: "fromPrice" | "toPrice", value: number) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(key, String(value))
		router.push(`${pathname}?${params.toString()}`, { scroll: false })
	}

	return (
		<div className={css.filterPrice}>
			<h4 className={css.filterPrice__title}>Ціна, ₴</h4>

			<div className={css.filterPrice__inputs}>
				<label className={css.filterPrice__label}>
					від
					<input
						type="number"
						className={css.filterPrice__input}
						value={minPrice}
						min={0}
						max={maxPrice - 1}
						onChange={(e) => {
							const val = Number(e.target.value)
							setMinPrice(val)
							handleChange("fromPrice", val)
						}}
					/>
				</label>

				<label className={css.filterPrice__label}>
					до
					<input
						type="number"
						className={css.filterPrice__input}
						value={maxPrice}
						min={minPrice + 1}
						onChange={(e) => {
							const val = Number(e.target.value)
							setMaxPrice(val)
							handleChange("toPrice", val)
						}}
					/>
				</label>
			</div>

			<div className={css.filterPrice__slider}>
				<input
					type="range"
					min={0}
					max={1000}
					value={minPrice}
					onChange={(e) => {
						const val = Math.min(Number(e.target.value), maxPrice - 1)
						setMinPrice(val)
						handleChange("fromPrice", val)
					}}
					className={css.filterPrice__range}
				/>

				<input
					type="range"
					min={0}
					max={1000}
					value={maxPrice}
					onChange={(e) => {
						const val = Math.max(Number(e.target.value), minPrice + 1)
						setMaxPrice(val)
						handleChange("toPrice", val)
					}}
					className={css.filterPrice__range}
				/>
			</div>

			<div className={css.filterPrice__values}>
				<span>{minPrice}</span> – <span>{maxPrice}</span> ₴
			</div>
		</div>
	)
}
