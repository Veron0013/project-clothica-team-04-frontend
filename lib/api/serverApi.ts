import { cookies } from "next/headers"
import { nextAuthServer } from "./api"

export const checkServerSession = async () => {
	// Дістаємо поточні cookie
	const cookieStore = await cookies()
	const res = await nextAuthServer.get("/auth/me", {
		headers: {
			// передаємо кукі далі
			Cookie: cookieStore.toString(),
		},
	})
	return res
}
