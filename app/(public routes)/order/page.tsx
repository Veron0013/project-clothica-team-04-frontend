"use client"
import GoodsOrderList from "@/components/GoodsOrderList/GoodsOrderList"
import css from "./page.module.css"
import UserOrderInfoForm from "@/components/UserOrderInfoForm/UserOrderInfoForm"

const CategoryPage = () => {
	return (
		<div className={css.wrapper}>
			<h2>Оформити замовлення</h2>
			<div className={css.flexbox}>
				<div className={css.flexbox_item}>
					<h4>Товари</h4>
					<GoodsOrderList />
				</div>
				<div className={css.flexbox_item}>
					<UserOrderInfoForm />
				</div>
			</div>
		</div>
	)
}

export default CategoryPage
