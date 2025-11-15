import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { api } from "../../api"
import { parse } from "cookie"
import { isAxiosError } from "axios"
import { logErrorResponse } from "../../_utils/utils"

export async function GET(request: NextRequest) {
	try {
		const cookieStore = await cookies()
		const refreshToken = cookieStore.get("refreshToken")?.value
		const next = request.nextUrl.searchParams.get("next") || "/"

		if (refreshToken) {
			const apiRes = await api.get("auth/session", {
				headers: {
					Cookie: cookieStore.toString(),
				},
			})
			const setCookie = apiRes.headers["set-cookie"]
			if (setCookie) {
				const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie]
				let accessToken = ""
				let refreshToken = ""
				let sessionId = ""

				for (const cookieStr of cookieArray) {
					const parsed = parse(cookieStr)
					if (parsed.accessToken) accessToken = parsed.accessToken
					if (parsed.refreshToken) refreshToken = parsed.refreshToken
					if (parsed.sessionId) sessionId = parsed.sessionId
				}

				if (accessToken) cookieStore.set("accessToken", accessToken)
				if (refreshToken) cookieStore.set("refreshToken", refreshToken)
				if (sessionId) cookieStore.set("sessionId", sessionId)

				return NextResponse.redirect(new URL(next, request.url), {
					headers: {
						"set-cookie": cookieStore.toString(),
					},
				})
			}
		}
		return NextResponse.redirect(new URL("/sign-in", request.url))
	} catch (error) {
		if (isAxiosError(error)) {
			logErrorResponse(error.response?.data)
			return NextResponse.redirect(new URL("/sign-in", request.url))
		}
		logErrorResponse({ message: (error as Error).message })
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}
