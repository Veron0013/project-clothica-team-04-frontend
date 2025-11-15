"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/authStore"
import { nextAuthServer } from "@/lib/api/api"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const setUser = useAuthStore((s) => s.setUser)
	const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated)

	useEffect(() => {
		const checkSession = async () => {
			try {
				const { data } = await nextAuthServer.get("/auth/refresh")
				if (data?.user) {
					setUser(data.user)
				} else {
					clearIsAuthenticated()
				}
			} catch (e) {
				clearIsAuthenticated()
			}
		}

		checkSession()
	}, [setUser, clearIsAuthenticated])

	return <>{children}</>
}
