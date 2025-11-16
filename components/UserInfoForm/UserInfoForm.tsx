"use client"

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik"
import * as Yup from "yup"
import css from "./UserInfoForm.module.css"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { updateMe } from "@/lib/api/clientApi"
import { PHONE_REGEXP } from "@/lib/vars"
import { useAuthStore } from "@/stores/authStore"
import toastMessage, { MyToastType } from "@/lib/messageService"

const UserInfoFormSchema = Yup.object().shape({
	name: Yup.string().min(2).max(20).required("Це поле обовʼязкове!"),
	lastname: Yup.string().min(3).max(20).required("Це поле обовʼязкове!"),
	phone: Yup.string().matches(PHONE_REGEXP, "Введіть коректний номер телефону").required("Це поле обовʼязкове!"),
	city: Yup.string().min(3).required("Це поле обовʼязкове!"),
	warehoseNumber: Yup.number().min(1).max(10).required("Це поле обовʼязкове!"),
})

interface UserInfoFormValues {
	name: string
	lastname: string
	phone: string
	city: string
	comment?: string
	warehoseNumber: number
}

interface Props {
	isOrder: boolean
}

export default function UserInfoForm({ isOrder = false }: Props) {
	const user = useAuthStore((state) => state.user)

	console.log("form-user", user, user?.name)

	const initialValues: UserInfoFormValues = {
		name: "Ваше імʼя",
		lastname: "Ваше прізвище",
		phone: user?.phone ? user.phone : "+38(0__) ___- __ - __",
		city: "Ваше місто",
		warehoseNumber: 1,
		comment: "Введіть ваш коментар",
	}

	const router = useRouter()

	const mutation = useMutation({
		mutationFn: (data: UserInfoFormValues) => updateMe(data),
		onSuccess: () => {
			toastMessage(MyToastType.success, "Ви успішно відредагували дані!")
			router.push("/")
		},
	})

	const handleSubmit = (values: UserInfoFormValues, actions: FormikHelpers<UserInfoFormValues>) => {
		mutation.mutate(values, {
			onSettled: () => {
				actions.setSubmitting(false)
			},
			onSuccess: () => {
				actions.resetForm({ values }) // оставляем актуальные значения
			},
		})
	}
	return (
		<div className={css.order_container}>
			<Formik initialValues={initialValues} validationSchema={UserInfoFormSchema} onSubmit={handleSubmit}>
				{({ isSubmitting }) => (
					<Form className={css.form}>
						<fieldset className={css.form}>
							<legend className={css.text}>Особиста інформація</legend>
							<div className={css.label_wrapper}>
								<div className={css.label}>
									<label htmlFor="name">Імʼя*</label>
									<ErrorMessage name="name" component="p" className={css.error} />
									<Field id="name" className={css.input} type="text" name="name" />
								</div>
								<div className={css.label}>
									<label htmlFor="lastname">Прізвище*</label>
									<Field id="lastname" className={css.input} type="text" name="lastname" />
									<ErrorMessage name="lastname" component="p" className={css.error} />
								</div>
							</div>
							<div className={css.label}>
								<label htmlFor="phone">Номер телефону*</label>
								<Field id="phone" className={css.inputTel} type="tel" name="phone" />
								<ErrorMessage name="phone" component="p" className={css.error} />
							</div>
							<div className={css.label_wrapper}>
								<div className={css.label}>
									<label htmlFor="city">Місто доставки*</label>
									<Field id="city" className={css.input} type="text" name="city" />
									<ErrorMessage name="city" component="p" className={css.error} />
								</div>
								<div className={css.label}>
									<label htmlFor="warehoseNumber">Номер відділення Нової Пошти*</label>

									<Field id="warehoseNumber" className={css.input} type="number" name="warehoseNumber" />
									<ErrorMessage name="warehoseNumber" component="p" className={css.error} />
								</div>
							</div>
							{isOrder && (
								<div className={css.label}>
									<label htmlFor="comment">Коментар</label>

									<Field id="comment" className={css.input} type="text" name="comment" />
									<ErrorMessage name="comment" component="p" className={css.error} />
								</div>
							)}
						</fieldset>

						{!isOrder ? (
							<button className={css.button} type="submit" disabled={isSubmitting || mutation.isPending}>
								{mutation.isPending ? "Збереження..." : "Зберегти зміни"}
							</button>
						) : (
							<button className={css.button} type="submit" disabled={isSubmitting || mutation.isPending}>
								{mutation.isPending ? "Оформлення замовлення..." : "Оформити замовлення"}
							</button>
						)}
					</Form>
				)}
			</Formik>
		</div>
	)
}
