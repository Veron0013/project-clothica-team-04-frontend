import { NextRequest, NextResponse } from "next/server"
import { api } from "../../api"
import { cookies } from "next/headers"
import { parse } from "cookie"
import { isAxiosError } from "axios"
import { logErrorResponse } from "../../_utils/utils"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const apiRes = await api.post("auth/register", body)

		const cookieStore = await cookies()
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
			return NextResponse.json(apiRes.data, { status: apiRes.status })
		}

		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	} catch (error) {
		//console.log(error)
		if (isAxiosError(error)) {
			logErrorResponse(error.response?.data)
			return NextResponse.json({ error: error.message, response: error.response?.data }, { status: error.status })
		}
		logErrorResponse({ message: (error as Error).message })
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}
