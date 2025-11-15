import { CategoriesResponse } from "@/types/categories"
import { AllFilters } from "@/types/filters"
import { BasketStoreOrder, Good, GoodsQuery, GoodsResponse } from "@/types/goods"
import { Order } from "@/types/orders"
import axios, { AxiosError } from "axios"

export type ApiError = AxiosError<{ error: string }>

export const nextAuthServer = axios.create({
	baseURL: process.env.NEXT_PUBLIC_PROXY_API_URL + "/api",
	withCredentials: true,
})

export const nextServer = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
})

export const getGoods = async (searchParams: GoodsQuery): Promise<GoodsResponse> => {
	const response = await nextServer.get("/goods", { params: searchParams })
	return response.data
}

export type BasketGoodsParams = {
	goodIds: Good["_id"][]
}

export const getGoodsFromArray = async (query: BasketGoodsParams): Promise<BasketStoreOrder[]> => {
	const response = await nextServer.post("/goods/from-array", query)
	return response.data
}

export const getCategories = async (page: number, limit?: number): Promise<CategoriesResponse> => {
	const response = await nextServer.get("/categories", {
		params: { page, limit },
	})

	return response.data
}

export const getFilterOptions = async (): Promise<AllFilters> => {
	const response = await nextServer.get("/goods/all-filters")
	return response.data
}

export const getUserOrders = async (userId: string): Promise<Order[]> => {
	const response = await nextServer.get<Order[]>(`/orders/${userId}`)
	return response.data
}
