import { GoodsQuery, GoodsResponse } from "@/types/goods"
import axios, { AxiosError } from "axios"

export type ApiError = AxiosError<{ error: string }>

export const nextServer = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL + "/",
	withCredentials: true,
})

export const getGoods = async (searchParams: GoodsQuery): Promise<GoodsResponse> => {
	const response = await nextServer.get("/goods", { params: searchParams })
	return response.data
}
