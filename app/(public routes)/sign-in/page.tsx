"use client"

// Додаємо імпорти
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, LoginRequest } from "@/lib/api/clientApi"
import css from "./SignInPage.module.css"
import { useAuthStore } from "@/lib/store/authStore"
import Link from "next/link"
import { ApiError } from "@/lib/api/api"

const SignIn = () => {
	const router = useRouter()
	const [error, setError] = useState("")
	const setUser = useAuthStore((state) => state.setUser)

	const handleSubmit = async (formData: FormData) => {
		try {
			// Типізуємо дані форми
			const formValues = Object.fromEntries(formData) as LoginRequest
			// Виконуємо запит
			const res = await login(formValues)

			if (!res.email && (res.error === "" || res.error === undefined)) {
				setError("Server under maintanance")
			} else if (res) {
				setUser(res)
				router.push("/profile")
			} else {
				setError("Invalid email or password")
			}
		} catch (error) {
			setError((error as ApiError).response?.data?.error ?? (error as ApiError).message ?? "Oops... some error")
		}
	}
	return (
		<>
			<main className={css.mainContent}>
				<h1 className={css.formTitle}>Sign in</h1>
				<form className={css.form} action={handleSubmit}>
					<div className={css.formGroup}>
						<label htmlFor="phone">Email</label>
						<input id="phone" type="phone" name="phone" className={css.input} required />
					</div>

					<div className={css.formGroup}>
						<label htmlFor="password">Password</label>
						<input id="password" type="password" name="password" className={css.input} required />
						<Link className={css.formLink} href={"/recovery"}>
							Forgot password?
						</Link>
					</div>

					<div className={css.actions}>
						<button type="submit" className={css.submitButton}>
							Log in
						</button>
					</div>
					{error && <p className={css.error}>{error}</p>}
				</form>
			</main>
		</>
	)
}

export default SignIn
