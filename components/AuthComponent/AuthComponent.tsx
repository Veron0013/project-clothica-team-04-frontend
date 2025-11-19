"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import css from "./AuthComponent.module.css"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"

import toastMessage, { MyToastType } from "@/lib/messageService"
import { useAuthStore } from "@/stores/authStore"
import { callAuth } from "@/lib/api/clientApi"
import { AuthValues } from "@/lib/api/authApi"
import { PHONE_REGEXP } from "@/lib/vars"
import { BiHide, BiShow } from "react-icons/bi"
import { useState } from "react"

interface AuthComponentProps {
	login?: boolean
}

const SignUpSchema = Yup.object().shape({
	name: Yup.string().min(2).max(20).required("Це поле обовʼязкове!"),
	phone: Yup.string().matches(PHONE_REGEXP, "Введіть коректний номер телефону").required("Це поле обовʼязкове!"),
	password: Yup.string().min(8).max(40).required("Це поле обовʼязкове!"),
})

const SignInSchema = Yup.object().shape({
	phone: Yup.string().matches(PHONE_REGEXP, "Введіть коректний номер телефону!").required("Це поле обовʼязкове!"),
	password: Yup.string().min(8).max(40).required("Це поле обовʼязкове!"),
})

export default function AuthComponent({ login = false }: AuthComponentProps) {
	const router = useRouter()
	const [show, setShow] = useState(false)

	const setUser = useAuthStore((s) => s.setUser)

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSubmit = async (values: AuthValues, { setSubmitting, setFieldError, setStatus, resetForm }: any) => {
		setStatus(null)
		const loadingId = toastMessage(MyToastType.loading, login ? "Вхід..." : "Реєстрація...")

		try {
			const user = await callAuth(login, values)
			//console.log("login", user, user?.user)
			if (!user) {
				//setStatus("Невідома помилка: користувача не отримано")
				toastMessage(MyToastType.error, "Сталася помилка. Спробуйте ще раз.")
				throw new Error("")
			}

			setUser(user)
			resetForm()

			toastMessage(MyToastType.success, login ? "Ви успішно увійшли!" : "Ви успішно зареєструвалися!")
			router.push("/")
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : "Unknown error"
			if (msg.includes("Phone and password required")) {
				setFieldError("phone", "Вкажіть телефон")
				setFieldError("password", "Вкажіть пароль")
			} else if (msg.includes("Invalid phone number")) {
				setFieldError("phone", "Некоректний номер телефону")
			} else if (msg.includes("Phone already in use")) {
				setFieldError("phone", "Цей номер вже використовується")
			} else if (msg.includes("Invalid phone or password")) {
				setFieldError("phone", "Невірний телефон або пароль")
				setFieldError("password", "Невірний телефон або пароль")
			} else {
				setStatus(msg)
			}
			toastMessage(MyToastType.error, msg)
		} finally {
			try {
				const { toast } = await import("react-hot-toast")
				toast.dismiss(loadingId)
			} catch {}
			setSubmitting(false)
		}
	}

	const initLoginValues: AuthValues = { phone: "", password: "" }
	const initRegValues: AuthValues = { name: "", phone: "", password: "" }

	return (
		<div className={css.wrapper}>
			<header className={css.header}>
				<Link href="/" className={css.logo} aria-label="Clothica logo">
					<svg width="84" height="36" aria-hidden="true">
						<use href="/sprite.svg#icon-company-logo" />
					</svg>
				</Link>
			</header>
			<div className={css.content}>
				<div className={css.buttonsBlock}>
					<div className={`${css.authBtn} ${!login ? css.active : ""}`}>
						<Link href="/sign-up">Реєстрація</Link>
					</div>
					<div className={`${css.authBtn} ${login ? css.active : ""}`}>
						<Link href="/sign-in">Вхід</Link>
					</div>
				</div>
				<Formik
					initialValues={login ? initLoginValues : initRegValues}
					validationSchema={login ? SignInSchema : SignUpSchema}
					onSubmit={handleSubmit}
				>
					{({ isSubmitting, errors, touched, status }) => (
						<Form>
							<h2 className={css.title}>{login ? "Вхід" : "Реєстрація"}</h2>

							{!login && (
								<div className={css.formGroup}>
									<label htmlFor="name">Імʼя*</label>
									<Field
										id="name"
										name="name"
										type="text"
										className={`${css.input} ${errors.name && touched.name ? css.inputError : ""}`}
										placeholder="Ваше імʼя"
										autoComplete="name"
									/>
									<ErrorMessage name="name" component="p" className={css.error} />
								</div>
							)}

							<div className={css.formGroup}>
								<label htmlFor="phone">Номер телефону*</label>
								<Field
									id="phone"
									name="phone"
									type="tel"
									inputMode="tel"
									className={`${css.input} ${errors.phone && touched.phone ? css.inputError : ""}`}
									placeholder="+38 (0__) ___-__-__"
									autoComplete="tel"
								/>
								<ErrorMessage name="phone" component="p" className={css.error} />
							</div>

							<div className={css.formGroup}>
								<label htmlFor="password">Пароль*</label>
								<div className={css.inputWrapper}>
								<Field
									id="password"
									name="password"
									type={!show ? "password" : "text"}
									className={`${css.input} ${errors.password && touched.password ? css.inputError : ""}`}
									placeholder="********"
									autoComplete={login ? "current-password" : "new-password"}
								/>
								<span className={css.toggleIcon} onClick={() => setShow(!show)}>
								{!show ? <BiHide /> : <BiShow />}
									</span>
									</div>
								<ErrorMessage name="password" component="p" className={css.error} />

								{login && 
									<Link href="/recovery" className={css.reset}> Забули пароль?</Link>
								}
							</div>

							{status && <p className={css.error}>{status}</p>}

							<button className={css.submitBtn} type="submit" disabled={isSubmitting}>
								{login ? (isSubmitting ? "Вхід..." : "Увійти") : isSubmitting ? "Реєстрація..." : "Зареєструватися"}
							</button>
						</Form>
					)}
				</Formik>
			</div>
			<footer className={css.footer}>
				<p>&copy; {new Date().getFullYear()} Clothica. Всі права захищені.</p>
			</footer>
		</div>
	)
}
