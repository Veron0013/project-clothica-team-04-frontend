import { NextResponse } from "next/server"
import { api } from "../../api"
import { cookies } from "next/headers"
import { isAxiosError } from "axios"
import { logErrorResponse } from "../../_utils/utils"

export async function POST() {
	const cookieStore = await cookies()

	try {
		const accessToken = cookieStore.get("accessToken")?.value
		const refreshToken = cookieStore.get("refreshToken")?.value
		const sessionId = cookieStore.get("sessionId")?.value

		await api.post("auth/logout", null, {
			headers: {
				Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}; sessionId=${sessionId}`,
			},
		})

		return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
	} catch (error) {
		if (isAxiosError(error)) {
			logErrorResponse(error.response?.data)
			return NextResponse.json({ error: error.message, response: error.response?.data }, { status: error.status })
		}
		logErrorResponse({ message: (error as Error).message })
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	} finally {
		cookieStore.delete("accessToken")
		cookieStore.delete("refreshToken")
		cookieStore.delete("sessionId")
	}
}
