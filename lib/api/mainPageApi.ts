import { Good, GoodCategory } from "@/types/goods"
import { nextServer } from "./api"

export interface FetchPopularGoodsProps {
	page: number
	limit: number
}

export interface FetchPopularGoodsResponse {
	items: Good[]
	page: number
	limit: number
	total: number
	totalPages: number
}

export interface FetchPopularCategoriesProps {
	page: number
	limit: number
}

export interface FetchPopularCategoriesResponse {
	categories: GoodCategory[]
	page: number
	limit: number
	totalCategories: number
	totalPages: number
}

export const fetchPopularGoods = async ({
	page,
	limit,
}: FetchPopularGoodsProps): Promise<FetchPopularGoodsResponse> => {
	const params: {
		page: number
		limit: number
	} = {
		page: page,
		limit: limit,
	}
	const response = await nextServer.get<FetchPopularGoodsResponse>("/top-rated", { params })
	return response.data
}

export const fetchPopularCategories = async ({
	page,
	limit,
}: FetchPopularCategoriesProps): Promise<FetchPopularCategoriesResponse> => {
	const params: {
		page: number
		limit: number
	} = {
		page,
		limit,
	}
	const response = await nextServer.get<FetchPopularCategoriesResponse>("/categories/popular", { params })
	return response.data
}
