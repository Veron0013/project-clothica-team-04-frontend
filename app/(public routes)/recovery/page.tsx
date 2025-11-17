"use client"

import Link from "next/link"
import css from "./RecoveryPassword.module.css"
import { useState } from "react"

export default function RecoveryPassword() {
	const [email, setEmail] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [message, setMessage] = useState("")

	const handleSubmit = async () => {
		setIsSubmitting(true)
		setMessage("")
		try {
			await fetch("/auth/request-reset-pwd", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			})

			// Бэкенд всегда отвечает 200, даже если email не найден
			setMessage("Якщо цей email існує — ми надіслали лінк для відновлення ✉️")
		} catch {
			setMessage("Сталася помилка. Спробуйте ще раз пізніше.")
		} finally {
			setIsSubmitting(false)
		}
	}
	return (
		<div className={css.wrapper}>
			<header className={css.header}>
				<Link href="/" className={css.logo} aria-label="Clothica logo">
					<svg width="84" height="36" aria-hidden="true">
						<use href="/sprite.svg#icon-company-logo" />
					</svg>
				</Link>
			</header>
			<div className={css.formCont}>
				<form className={css.form} onSubmit={handleSubmit}>
					<label htmlFor="email">E-mail</label>
					<input
						name="email"
						type="email"
						placeholder="Введіть ваш email"
						className={css.input}
						required
						aria-label="Email для скидання паролю"
						pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<button type="submit" className={css.button}>
						{isSubmitting ? "Відправляю..." : "Відправлено"}
					</button>
				</form>
				{message && <p className={css.message}>{message}</p>}
			</div>
		</div>
	)
}
