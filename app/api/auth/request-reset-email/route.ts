import { NextRequest, NextResponse } from "next/server"
import { api } from "../../api"
import { cookies } from "next/headers"
import { isAxiosError } from "axios"
import { logErrorResponse } from "../../_utils/utils"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const cookieStore = await cookies()

		const accessToken = cookieStore.get("accessToken")?.value
		const refreshToken = cookieStore.get("refreshToken")?.value
		const sessionId = cookieStore.get("sessionId")?.value

		const { data, status } = await api.post("auth/request-reset-email", body, {
			headers: {
				Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}; sessionId=${sessionId}`,
			},
		})

		console.log("reset-email", data, status)

		return NextResponse.json(data, { status: status ?? 500 })
		//return NextResponse.json(apiRes.data, { status: apiRes.status })
	} catch (error) {
		if (isAxiosError(error)) {
			logErrorResponse(error.response?.data)
			return NextResponse.json(
				{ error: error.message, response: error.response?.data },
				{ status: error.status || 500 }
			)
		}
		logErrorResponse({ message: (error as Error).message })
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
	}
}
