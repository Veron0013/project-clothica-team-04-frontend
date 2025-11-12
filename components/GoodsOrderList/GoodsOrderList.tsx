"use client"

import { useEffect, useState } from "react"
import { useBasket } from "@/stores/basketStore"
import { BasketStoreGood } from "@/types/goods"
import Image from "next/image"
import { getGoodsFromArray } from "@/lib/api/api"

export default function GoodsOrderList() {
	const { goods: basketGoods, updateGoodQuantity, removeGood } = useBasket()
	const [goodsData, setGoodsData] = useState<BasketStoreGood[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchGoods() {
			if (basketGoods.length === 0) {
				setGoodsData([])
				return
			}

			try {
				setLoading(true)
				// робимо запит на бек, передаємо масив id
				const data = await getGoodsFromArray({ goodIds: basketGoods.map((g) => g.id) })

				// Мерджимо quantity зі стору
				const merged = data.map((item) => {
					const found = basketGoods.find((g) => g.id === item._id)
					return {
						...item,
						quantity: found?.quantity || 1,
					}
				})

				setGoodsData(merged)
			} catch (err) {
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchGoods()
	}, [basketGoods])

	if (loading) return <div className="basket-loading">Loading...</div>
	if (goodsData.length === 0) return <div className="basket-empty">Кошик порожній</div>
	return (
		<div className="basket-container">
			{goodsData.map((item) => (
				<div key={item._id} className="basket-item">
					<Image src={item.image} alt={item.name} width={82} height={100} className="basket-item-image" />

					<div className="basket-item-info">
						<div className="basket-item-name">{item.name}</div>
						{item.feedbackCount !== undefined && (
							<div className="basket-item-feedback">
								{item.averageRating ? `⭐ ${item.averageRating} / ` : ""}
								{item.feedbackCount} відгуків
							</div>
						)}
						<div className="basket-item-price">
							{item.price} {item.currency}
						</div>
					</div>

					<input
						type="number"
						min={1}
						value={item.quantity}
						onChange={(e) => updateGoodQuantity(item._id, Number(e.target.value))}
						className="basket-item-quantity"
					/>

					<button onClick={() => removeGood(item._id)} className="basket-item-remove">
						Видалити
					</button>
				</div>
			))}
		</div>
	)
}
