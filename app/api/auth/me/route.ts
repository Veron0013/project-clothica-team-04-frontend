export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { api } from "../../api"
import { cookies } from "next/headers"
import { logErrorResponse } from "../../_utils/utils"
import { isAxiosError } from "axios"
import { parse } from "cookie"

export async function GET() {
	try {
		const cookieStore = await cookies()
		//return NextResponse.json({ error: cookieStore.toString() }, { status: 500 })
		const res = await api.get("/auth/me", {
			headers: {
				Cookie: cookieStore.toString(),
			},
		})

		const setCookie = res.headers["set-cookie"]

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
		}

		return NextResponse.json(res.data, { status: res.status })
	} catch (error) {
		if (isAxiosError(error)) {
			logErrorResponse(error.response?.data)
			return NextResponse.json({ error: error.message, response: error.response?.data }, { status: error.status })
		}
		logErrorResponse({ message: (error as Error).message })
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}
