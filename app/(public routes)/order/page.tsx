"use client"
import GoodsOrderList from "@/components/GoodsOrderList/GoodsOrderList"
import UserInfoForm from "@/components/UserInfoForm/UserInfoForm"
import css from "./page.module.css"

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
					<UserInfoForm isOrder={true} />
				</div>
			</div>
		</div>
	)
}

export default CategoryPage
