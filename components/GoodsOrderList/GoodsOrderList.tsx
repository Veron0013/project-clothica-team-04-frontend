"use client"

import { useEffect, useState, useMemo } from "react"
import { useBasket } from "@/stores/basketStore"
import { BasketStoreOrder } from "@/types/goods"
import Image from "next/image"
import { getGoodsFromArray } from "@/lib/api/api"
import css from "./GoodsOrderList.module.css"

export default function GoodsOrderList() {
	const basketGoods = useBasket((state) => state.goods)
	const updateGoodQuantity = useBasket((state) => state.updateGoodQuantity)
	const removeGood = useBasket((state) => state.removeGood)

	const [goodsData, setGoodsData] = useState<BasketStoreOrder[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchGoods() {
			if (basketGoods.length === 0) {
				setGoodsData([])
				return
			}

			try {
				setLoading(true)

				// 1️⃣ Запитуємо у бекенда тільки id
				const data = await getGoodsFromArray({
					goodIds: basketGoods.map((g) => g.id),
				})

				// 2️⃣ Перетворюємо бекенд-результат у мапу для швидкого доступу
				const mapById = new Map(data.map((item) => [item._id, item]))

				// 3️⃣ Будуємо масив товарів з урахуванням size/color/key/quantity
				const merged = basketGoods
					.map((cartItem) => {
						const serverItem = mapById.get(cartItem.id)

						if (!serverItem) return null // товар пропав з БД

						return {
							...serverItem, // товар з сервера
							size: cartItem.size, // твій варіант
							color: cartItem.color,
							key: cartItem.key,
							quantity: cartItem.quantity,
						}
					})
					.filter(Boolean) as BasketStoreOrder[]

				setGoodsData(merged)
			} catch (err) {
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchGoods()
	}, [basketGoods])

	//  Обчислення проміжного підсумку та загальної суми
	const subtotal = useMemo(() => {
		return goodsData.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
	}, [goodsData])

	const deliveryCost = subtotal > 0 ? 99 : 0 // умовна доставка
	const total = subtotal + deliveryCost

	if (loading) return <div className={css.basketLoading}>Loading...</div>
	if (goodsData.length === 0) return <div className={css.basketEmpty}>Кошик порожній</div>
	return (
		<div className={css.basketContainer}>
			{goodsData.map((item) => (
				<div key={item.key} className={css.basketItem}>
					<Image src={item.image} alt={item.name} width={82} height={100} className={css.basketItemImage} />
					<div className={css.basketCard}>
						<div className={css.basketItemInfo}>
							<div className={css.basketItemHead}>
								<div className={css.basketItemName}>{item.name}</div>
								{item.feedbackCount !== undefined && (
									<div className={css.basketItemFeedback}>
										{item.averageRating ? (
											<>
												<svg width="12" height="12">
													<use href="/sprite.svg#star-filled" />
												</svg>{" "}
												{item.averageRating}
											</>
										) : (
											<>
												<svg width="12" height="12">
													<use href="/sprite.svg#star" />
												</svg>{" "}
												0
											</>
										)}
										<svg width="12" height="12">
											<use href="/sprite.svg#feedbacks" />
										</svg>{" "}
										{item.feedbackCount}
									</div>
								)}
								{item.size !== undefined && <div className={css.basketItemFeedback}>розмір: {item.size} </div>}
								{item.size !== undefined && <div className={css.basketItemFeedback}>колір: {item.color} </div>}
							</div>
							<div className={css.basketItemPrice}>
								{item.price} {item.currency}
							</div>
						</div>
						<div className={css.basketInputBtn}>
							<input
								type="number"
								min={1}
								value={item.quantity}
								onChange={(e) => updateGoodQuantity(item.key, Number(e.target.value))}
								className={css.basketItemQuantity}
							/>

							<button onClick={() => removeGood(item.key)} className={css.basketItemRemove}>
								<svg width="24" height="24">
									<use href="/sprite.svg#delete" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			))}

			<div className={css.basketSummaryItem}>
				<div className={css.basketSummaryRow}>
					<div className={css.basketSumTitle}>Проміжний підсумок:</div>
					<div className={css.basketSumCost}>{subtotal.toFixed(2)} грн</div>
				</div>
				<div className={css.basketDelivery}>
					<div className={css.basketSumTitle}>Доставка:</div>
					<div className={css.basketSumCost}>{deliveryCost.toFixed(2)} грн</div>
				</div>
				<div className={css.basketSummaryTotal}>
					<div className={css.basketTotalTitle}>Всього:</div>
					<div className={css.basketTotalPrice}>{total.toFixed(2)} грн</div>
				</div>
			</div>
		</div>
	)
}
