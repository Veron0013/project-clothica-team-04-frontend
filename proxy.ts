// middleware.ts

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { checkServerSession } from "./lib/api/serverApi"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

const privateRoutes = ["/profile"]
const publicRoutes = ["/sign-in", "/sign-up"]

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const cookieStore = await cookies()
	const accessToken = cookieStore.get("accessToken")?.value
	const refreshToken = cookieStore.get("refreshToken")?.value
	const sessionId = cookieStore.get("sessionId")?.value

	const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

	const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
	const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route))

	console.log("IP:", ip, isPublicRoute, isPrivateRoute, accessToken)

	if (!accessToken) {
		if (refreshToken && sessionId) {
			let data = null
			try {
				data = await checkServerSession()
			} catch (error) {
				return NextResponse.redirect(new URL("/", request.url))
			}

			console.log("==middleware==", data)

			if (!data.data.success) {
				console.log("go home data")
				goHome(cookieStore, request)
			}

			const setCookie = data.headers["set-cookie"]

			const response = isPrivateRoute ? NextResponse.next() : NextResponse.redirect(new URL("/", request.url))

			if (setCookie) {
				const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie]
				for (const c of cookieArray) {
					response.headers.append("set-cookie", c)
				}
			}
			return response
		} else {
			console.log("go home", sessionId, refreshToken)
			goHome(cookieStore, request)
		}
		// Якщо refreshToken або сесії немає:
		// публічний маршрут — дозволяємо доступ

		if (isPublicRoute) {
			return NextResponse.next()
		}

		// приватний маршрут — редірект на сторінку входу
		if (isPrivateRoute) {
			return NextResponse.redirect(new URL("/sign-in", request.url))
		}
	}

	//console.log("*middleware*", refreshToken, isPublicRoute)

	// Якщо accessToken існує:
	// публічний маршрут — виконуємо редірект на головну
	if (isPublicRoute) {
		return NextResponse.redirect(new URL("/", request.url))
	}
	// приватний маршрут — дозволяємо доступ
	if (isPrivateRoute) {
		return NextResponse.next()
	}

	//fallback
	return NextResponse.next()
}

export const config = {
	matcher: ["/profile/:path*", "/sign-in", "/sign-up"],
	//matcher: ["/sign-in", "/sign-up"],
}

const goHome = (cookieStore: ReadonlyRequestCookies, request: NextRequest) => {
	cookieStore.delete("accessToken")
	cookieStore.delete("refreshToken")
	cookieStore.delete("sessionId")
	//return NextResponse.redirect(new URL("/sign-up", request.url))
}
