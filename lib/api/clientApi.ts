import { User } from "@/types/user"
import { nextAuthServer } from "./api"

//axios.defaults.baseURL = MAIN_URL
//axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
export type LoginRequest = {
	phone: string
	password: string
}

export type ResetPasswordSendmailRequest = {
	email: string
}

export type RestorePasswordRequest = {
	token: string
	password: string
}

export type RegisterRequest = {
	phone: string
	password: string
	username: string
}

type CheckSessionRequest = {
	success: boolean
}

export interface SearchParams {
	search: string
	page?: number
	limit?: number
}

export interface ApiQueryParams {
	params: SearchParams
}

export type Category = {
	_id: string
	name: string
	image: string
	description: string
	createdAt: string
	updatedAt: string
}

export type UpdateUserRequest = {
	username?: string
	city?: string
	warehouse?: string
	fullname?: string
	phone?: string
	avatar?: File | null
}

export type AuthValues = {
	username?: string
	phone: string
	password: string
}

////////////////////////////////////////

export async function callAuth(isLogin: boolean, values: AuthValues) {
	return isLogin ? await login(values) : await register(values)
}

export const register = async (data: AuthValues) => {
	const res = await nextAuthServer.post<User>("/auth/register", data)
	return res.data
}

export const login = async (data: AuthValues) => {
	const res = await nextAuthServer.post<User>("/auth/login", data)
	return res.data
}

export const logout = async (): Promise<void> => {
	await nextAuthServer.post("/auth/logout")
}

export const checkSession = async () => {
	const res = await nextAuthServer.get<CheckSessionRequest>("/auth/me")
	return res.data.success
}

export const getMe = async () => {
	const refreshSession = await checkSession()
	if (refreshSession) {
		const { data } = await nextAuthServer.get<User>("/users/me")
		return data
	} else {
		throw new Error(JSON.stringify({ message: "Session expired", code: 401 }))
	}
}

export const updateMe = async (payload: UpdateUserRequest) => {
	const refreshSession = await checkSession()

	if (refreshSession) {
		const formData = new FormData()

		if (payload.username) formData.append("username", payload.username)
		if (payload.avatar) formData.append("avatar", payload.avatar)

		const res = await nextAuthServer.patch<User>("/users/me", formData)
		return res.data
	} else {
		throw new Error(JSON.stringify({ message: "Session expired", code: 401 }))
	}
}

export const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData()
	formData.append("file", file)
	const { data } = await nextAuthServer.post("/upload", formData)
	return data.url
}

export const passwordSendMail = async (email: ResetPasswordSendmailRequest) => {
	const res = await nextAuthServer.post("/auth/request-reset-email", email)
	return res
}

export const resetPassword = async (body: RestorePasswordRequest) => {
	const res = await nextAuthServer.post("/auth/reset-password", body)
	return res
}
