"use client"

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik"
import * as Yup from "yup"
import css from "./UserOrderInfoForm.module.css"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { sendOrder } from "@/lib/api/clientApi"
import { DELIVERY_PRICE, PHONE_REGEXP } from "@/lib/vars"
import { useAuthStore } from "@/stores/authStore"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { useBasket } from "@/stores/basketStore"
import { UserOrderInfoFormValues } from "@/types/user"
import { Order } from "@/types/orders"

const UserInfoFormSchema = Yup.object().shape({
	name: Yup.string().min(2).max(20).required("Це поле обовʼязкове!"),
	lastname: Yup.string().min(3).max(20).required("Це поле обовʼязкове!"),
	phone: Yup.string().matches(PHONE_REGEXP, "Введіть коректний номер телефону").required("Це поле обовʼязкове!"),
	city: Yup.string().min(3).required("Це поле обовʼязкове!"),
	warehoseNumber: Yup.string().min(1).max(36).required("Це поле обовʼязкове!"),
	comment: Yup.string().min(5),
})

export default function UserOrderInfoForm() {
	const user = useAuthStore((state) => state.user)
	const basketGoods = useBasket((state) => state.goods)
	const router = useRouter()

	//console.log("form-user-order", user, user?.name)

	const mutation = useMutation({
		mutationFn: (data: Order) => sendOrder(data),
		onSuccess: () => {
			toastMessage(MyToastType.success, "Ви успішно відправили замовлення! Очікуйте на доставку")
			router.push("/")
		},
	})

	const handleSubmit = (values: UserOrderInfoFormValues, actions: FormikHelpers<UserOrderInfoFormValues>) => {
		if (basketGoods.length === 0) {
			toastMessage(MyToastType.error, "Кошик порожній!")
			actions.setSubmitting(false)
			return
		}

		// Формуємо об'єкт Order
		const order: Order = {
			userId: user?._id || null,
			items: basketGoods.map((item) => ({
				productId: item.id,
				quantity: item.quantity,
				price: item.price,
			})),
			totalAmount: DELIVERY_PRICE + basketGoods.reduce((sum, i) => sum + i.quantity * i.price, 0),
			deliveryDetails: {
				address: `${values.city}, ${values.warehoseNumber}`,
				phone: values.phone,
				fullName: `${values.name}${values.lastname.toUpperCase()}`,
			},
			comment: values.comment || "",
		}

		console.log("order", order)

		mutation.mutate(order, {
			onSettled: () => actions.setSubmitting(false),
			onSuccess: () => actions.resetForm({ values }),
		})
	}

	const getInputClass = (error: unknown, touched: boolean | undefined) => {
		return error && touched ? `${css.input} ${css.inputError}` : css.input
	}
	return (
		<div className={css.order_container}>
			<Formik
				enableReinitialize
				initialValues={{
					name: user?.name || "",
					lastname: user?.lastName || "",
					phone: user?.phone || "",
					city: user?.city || "",
					warehoseNumber: user?.warehoseNumber ? user.warehoseNumber : "1",
					comment: "",
				}}
				validationSchema={UserInfoFormSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting, errors, touched }) => (
					<Form className={css.form}>
						<fieldset className={css.form}>
							<legend className={css.text}>Особиста інформація</legend>
							<div className={css.label_wrapper}>
								<div className={css.label}>
									<label htmlFor="name" aria-placeholder="name">
										Імʼя*
									</label>
									<Field
										id="name"
										className={getInputClass(errors.name, touched.name)}
										type="text"
										name="name"
										placeholder="Ваше імʼя"
									/>
									<ErrorMessage name="name" component="p" className={css.error} />
								</div>
								<div className={css.label}>
									<label htmlFor="lastname">Прізвище*</label>
									<Field
										id="lastname"
										type="text"
										name="lastname"
										placeholder="Ваше прізвище"
										className={getInputClass(errors.lastname, touched.lastname)}
									/>
									<ErrorMessage name="lastname" component="p" className={css.error} />
								</div>
							</div>
							<div className={css.label}>
								<label htmlFor="phone">Номер телефону*</label>
								<Field
									id="phone"
									className={getInputClass(errors.phone, touched.phone)}
									type="tel"
									name="phone"
									placeholder="+38(0__) ___- __ - __"
								/>
								<ErrorMessage name="phone" component="p" className={css.error} />
							</div>
							<div className={css.label_wrapper}>
								<div className={css.label}>
									<label htmlFor="city">Місто доставки*</label>
									<Field
										id="city"
										className={getInputClass(errors.city, touched.city)}
										type="text"
										name="city"
										placeholder="Ваше місто"
									/>
									<ErrorMessage name="city" component="p" className={css.error} />
								</div>
								<div className={css.label}>
									<label htmlFor="warehoseNumber">Номер відділення Нової Пошти*</label>

									<Field
										id="warehoseNumber"
										className={getInputClass(errors.warehoseNumber, touched.warehoseNumber)}
										type="text"
										name="warehoseNumber"
										placeholder="№ відділення"
									/>
									<ErrorMessage name="warehoseNumber" component="p" className={css.error} />
								</div>
							</div>

							<div className={css.label}>
								<label htmlFor="comment">Коментар</label>

								<Field
									id="comment"
									className={getInputClass(errors.comment, touched.comment)}
									type="text"
									name="comment"
									placeholder=""
								/>
								<ErrorMessage name="comment" component="p" className={css.error} />
							</div>
						</fieldset>

						<button className={css.button} type="submit" disabled={isSubmitting || mutation.isPending}>
							{mutation.isPending ? "Оформлення замовлення..." : "Оформити замовлення"}
						</button>
					</Form>
				)}
			</Formik>
		</div>
	)
}
