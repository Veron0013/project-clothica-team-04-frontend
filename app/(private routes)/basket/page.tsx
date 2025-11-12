"use client"

import { useRouter } from "next/navigation"
import { useBasket } from "@/stores/basketStore"
import Modal from "@/components/Modal/Modal"
// import { GoodsOrderList } from "@/components/GoodsOrderList";
import style from "./ModalBasket.module.css"
// import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo";

export default function BasketModalPage() {
	const router = useRouter()
	const { goods } = useBasket()

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

				<h2 className={style.title}>Ваш кошик</h2>

				{goods.length > 0 ? (
					<>
						{/* <GoodsOrderList goods={goods} /> */}

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
						{/* <MessageNoInfo text="Ваш кошик порожній, мершій до покупок!" /> */}
						<button onClick={() => router.push("/goods")} className={style.btnBasketEmpty}>
							До покупок
						</button>
					</div>
				)}
			</div>
		</Modal>
	)
}
