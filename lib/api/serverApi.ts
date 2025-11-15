import { cookies } from "next/headers"
import { nextServer } from "./api"
import { User } from "@/types/user"

export const checkServerSession = async () => {
	// Дістаємо поточні cookie
	const cookieStore = await cookies()
	const res = await nextServer.get("/auth/me", {
		headers: {
			// передаємо кукі далі
			Cookie: cookieStore.toString(),
		},
	})
	return res
}

export const getServerMe = async (): Promise<User> => {
	const cookieStore = await cookies()
	const { data } = await nextServer.get("/users/me", {
		//headers: {
		//	Cookie: cookieStore.toString(),
		//},
	})
	return data
}

//export const createQueryParams = (search = "", page = 1, tag?: string): ApiQueryParams => {
//	const params: SearchParams = {
//		search,
//		page,
//		perPage: PER_PAGE,
//	}
//	//console.log(tag)
//	if (tag !== "All") {
//		params.tag = tag as Tag
//	}

//	return { params }
//}
