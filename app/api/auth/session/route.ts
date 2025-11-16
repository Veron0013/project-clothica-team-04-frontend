import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { api } from "../../api"
import { parse } from "cookie"
import { isAxiosError } from "axios"
import { logErrorResponse } from "../../_utils/utils"

export async function GET() {
	try {
		const cookieStore = await cookies()
		//console.log("object", cookieStore)
		const accessToken = cookieStore.get("accessToken")?.value
		const refreshToken = cookieStore.get("refreshToken")?.value
		const sessionId = cookieStore.get("sessionId")?.value

		if (accessToken) {
			return NextResponse.json({ success: true })
		}

		if (refreshToken && sessionId) {
			const apiRes = await api.get("auth/session", {
				headers: {
					Cookie: cookieStore.toString(),
				},
			})

			const setCookie = apiRes.headers["set-cookie"]

			if (setCookie) {
				const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie]
				for (const cookieStr of cookieArray) {
					const parsed = parse(cookieStr)

					const options = {
						expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
						path: parsed.Path,
						maxAge: Number(parsed["Max-Age"]),
					}

					if (parsed.accessToken) cookieStore.set("accessToken", parsed.accessToken, options)
					if (parsed.refreshToken) cookieStore.set("refreshToken", parsed.refreshToken, options)
					if (parsed.sessionId) cookieStore.set("sessionId", parsed.sessionId, options)
				}
				return NextResponse.json({ success: true }, { status: 200 })
			}
		}
		return NextResponse.json({ success: false }, { status: 200 })
	} catch (error) {
		if (isAxiosError(error)) {
			logErrorResponse(error.response?.data)
			return NextResponse.json({ success: false }, { status: 200 })
		}
		logErrorResponse({ message: (error as Error).message })
		return NextResponse.json({ success: false }, { status: 200 })
	}
}
