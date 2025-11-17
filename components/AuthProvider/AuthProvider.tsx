"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/authStore"
import { checkSession, getUsersMe } from "@/lib/api/clientApi"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const setUser = useAuthStore((s) => s.setUser)
	const user = useAuthStore((s) => s.user)
	const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated)

	useEffect(() => {
		const fetchCheckSession = async () => {
			try {
				const isAuthenticated = await checkSession()

				if (isAuthenticated && user) return

				if (isAuthenticated && !user) {
					const newUser = await getUsersMe()
					if (newUser) setUser(newUser)
				} else {
					clearIsAuthenticated()
				}
			} catch (e) {
				console.log("auth-error", e)
				clearIsAuthenticated()
			}
		}

		fetchCheckSession()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setUser, clearIsAuthenticated])

	return <>{children}</>
}
