// app/api/np/cities/route.ts
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { GET_CITIES_METHOD, GET_MODEL } from "@/lib/api/nPostApi"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const npRes = await axios.post(process.env.NEXT_PUBLIC_NOVA_POST_URL || "", {
			apiKey: process.env.NEXT_PUBLIC_NOVA_POST_API,
			modelName: GET_MODEL,
			calledMethod: GET_CITIES_METHOD,
			methodProperties: body,
		})

		return NextResponse.json(npRes.data)
	} catch (e) {
		console.log("NP cities error:", e)
		return NextResponse.json({ error: "NP error" }, { status: 500 })
	}
}
