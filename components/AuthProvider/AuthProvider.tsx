"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/authStore"
import { checkSession, getUsersMe } from "@/lib/api/clientApi"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const setUser = useAuthStore((s) => s.setUser)
	const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated)

	useEffect(() => {
		const fetchCheckSession = async () => {
			//try {
			const isAuthenticated = await checkSession()

			if (isAuthenticated) {
				const user = await getUsersMe()
				console.log("auth", user)
				if (user) setUser(user)
			} else {
				clearIsAuthenticated()
			}
			//} catch (e: unknown) {
			//	console.log("auth-error", e)
			//	clearIsAuthenticated()
			//}
		}

		fetchCheckSession()
	}, [setUser, clearIsAuthenticated])

	return <>{children}</>
}
