export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { api } from "../../api"
import { cookies } from "next/headers"
import { logErrorResponse } from "../../_utils/utils"
import { isAxiosError } from "axios"

export async function GET() {
	try {
		const cookieStore = await cookies()
		//return NextResponse.json({ error: cookieStore.toString() }, { status: 500 })
		const res = await api.get("/auth/me", {
			headers: {
				Cookie: cookieStore.toString(),
			},
		})
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

export async function PATCH(request: Request) {
	try {
		const cookieStore = await cookies()
		const formData = await request.formData()

		const username = formData.get("username") as string | null
		const avatar = formData.get("avatar") as File | null

		const body = new FormData()

		if (username) body.append("username", username)
		if (avatar) body.append("avatar", avatar)

		const res = await api.patch("/users/me", body, {
			headers: {
				Cookie: cookieStore.toString(),
				"Content-Type": "multipart/form-data",
			},
		})
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
