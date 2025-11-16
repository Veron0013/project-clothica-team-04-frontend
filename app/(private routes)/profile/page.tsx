"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import UserInfoForm from "@/components/UserInfoForm/UserInfoForm"
import { useAuthStore } from "@/stores/authStore"

import toastMessage, { MyToastType } from "@/lib/messageService"

import css from "./ProfilePage.module.css"
import { Order } from "@/types/orders"
import { getUserOrders } from "@/lib/api/api"
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"
import { logout } from "@/lib/api/clientApi"

export default function ProfilePage() {
	const router = useRouter()
	const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated)

	const userId = useAuthStore((state) => state.user?._id)
	const [orders, setOrders] = useState<Order[]>([])
	const [isLoadingOrders, setIsLoadingOrders] = useState(false)
	const [ordersError, setOrdersError] = useState<string | null>(null)

	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const handleLogout = async () => {
		if (isLoggingOut) return

		try {
			setIsLoggingOut(true)
			await logout()
			clearIsAuthenticated()
			router.push("/")
		} catch (error) {
			toastMessage(MyToastType.error, "Не вдалося вийти з кабінету. Спробуйте ще раз.")
			console.error(error)
		} finally {
			setIsLoggingOut(false)
		}
	}

	useEffect(() => {
		if (!userId) return

		const fetchOrders = async () => {
			try {
				setIsLoadingOrders(true)
				setOrdersError(null)

				const data = await getUserOrders()
				setOrders(data)
			} catch (error) {
				console.error(error)
				setOrdersError("Не вдалося завантажити замовлення.")
			} finally {
				setIsLoadingOrders(false)
			}
		}

		fetchOrders()
	}, [userId])

	const formatStatus = (status: Order["status"]) => {
		switch (status) {
			case "in_process":
				return "У процесі"
			case "assembling":
				return "Комплектується"
			case "completed":
				return "Виконано"
			case "canceled":
				return "Скасовано"
			default:
				return status
		}
	}

	//console.log("order", orders)

	return (
		<div className={css.profile}>
			<h2 className={css.title}>Кабінет</h2>

			<div className={css.profCont}>
				<div className={css.information}>
					<UserInfoForm isOrder={false} />
				</div>

				<div className={css.order}>
					<h3 className={css.text}>Мої замовлення</h3>

					{isLoadingOrders && <p>Завантаження замовлень...</p>}

					{ordersError && <p className={css.error}>{ordersError}</p>}

					{!isLoadingOrders && !ordersError && orders.length === 0 && (
						<MessageNoInfo
							text="У вас ще не було жодних замовлень! Мерщій до покупок!"
							buttonText="До покупок"
							route="/goods"
						/>
					)}

					{orders.length > 0 && (
						<ul className={css.orderList}>
							{orders.map((order) => (
								<li key={order._id} className={css.orderItem}>
									<div className={css.orderCol}>
										<p className={css.orderDate}>{new Date(order.createdAt).toLocaleDateString("uk-UA")}</p>
										<p className={css.orderNumber}>№ {order.orderNumber}</p>
									</div>
									<div className={css.orderCol}>
										<p className={css.orderLabel}>Сума: </p>
										<p className={css.orderValue}>
											{order.totalAmount} {order.currency}
										</p>
									</div>

									<div className={css.orderColSt}>
										<p className={css.orderLabel}>Статус: </p>
										<p className={css.orderValue}>{formatStatus(order.status)}</p>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<div>
				<button type="button" className={css.logoutBtn} onClick={handleLogout} disabled={isLoggingOut}>
					{isLoggingOut ? "Виходжу..." : "Вийти з кабінету"}
				</button>
			</div>
		</div>
	)
}

// import UserInfoForm from "@/components/UserInfoForm/UserInfoForm";
// import Link from "next/link";
// import css from "./ProfilePage.module.css";

// export default function ProfilePage() {
//   return (
//     <div className="container">
//       <h2 className={css.title}>Кабінет</h2>
//       <div className={css.profCont}>
//         <div className={css.information}>
//           <UserInfoForm isOrder={false} />
//         </div>
//         <div className={css.order}>
{
	/* <h3 className={css.text}>Мої замовлення</h3>
          <ul className={css.orderList}>
            <li className={css.orderItem}>
              <div className={css.orderCol}>
                <p className={css.orderDate}></p>
                <p className={css.orderNumber}>№ 12334455</p>
              </div>
              <div className={css.orderCol}>
                <p className={css.orderLabel}>Сума: </p>
                <p className={css.orderValue}> 23456</p>
              </div>

              <div className={css.orderColSt}>
                <p className={css.orderLabel}>Статус: </p>
                <p className={css.orderValue}> Виконано</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className={css.buttonLog}>
        <div className={css.logoutBtn}>
          <Link href="">Вийти з кабінету</Link>
        </div>
      </div>
    </div>
  );
} */
}
