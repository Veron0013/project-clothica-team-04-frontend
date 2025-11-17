"use client"

import { useRouter } from "next/navigation"
import { useBasket } from "@/stores/basketStore"
import Modal from "@/components/Modal/Modal"
import style from "./ModalBasket.module.css"
import GoodsOrderList from "@/components/GoodsOrderList/GoodsOrderList"
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"

export default function BasketModalPage() {
	const router = useRouter()
	const goods = useBasket((state) => state.goods)

	return (
		<Modal
			open={true}
			onClose={() => {
				router.back()
			}}
		>
			<div className={style.modal} onClick={(e) => e.stopPropagation()}>
				<button
					onClick={() => {
						router.back()
					}}
					className={style.closeBtn}
				>
					<svg width="24" height="24">
						<use href="/sprite.svg#close" />
					</svg>
				</button>

				<div className={style.title}>Ваш кошик</div>

				{goods.length > 0 ? (
					<>
						<GoodsOrderList />

						<div className={style.btnForm}>
							<button onClick={() => router.push("/goods")} className={style.btnGoods}>
								Продовжити покупки
							</button>
							<button onClick={() => router.push("/order")} className={style.btnOrder}>
								Оформити замовлення
							</button>
						</div>
					</>
				) : (
					<div className={style.basketEmpty}>
						<MessageNoInfo text="Ваш кошик порожній, мершій до покупок!" buttonText="До покупок" route="/goods" />
					</div>
				)}
			</div>
		</Modal>
	)
}
