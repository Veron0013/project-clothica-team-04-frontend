import { nextServer } from "@/lib/api/api"
import { checkSession } from "@/lib/api/clientApi"
import { Good } from "@/types/goods"

export const GENDERS = ["male", "female", "unisex"] as const
export const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"] as const
export const COLORS = ["white", "black", "grey", "blue", "green", "red", "pastel"] as const

export type goodsSize = (typeof SIZES)[number]
export type goodsGender = (typeof GENDERS)[number]
export type goodsColor = (typeof COLORS)[number]

export interface GoodsFilter {
	size?: goodsSize[] // множественный выбор размеров
	gender?: goodsGender // один из GENDERS
	color?: goodsColor[] // множественный выбор цветов
	price_from?: number // нижняя граница цены
	price_to?: number // верхняя граница цены
}

export interface Feedback {
	_id: string
	goodId: string
	userId?: string
	rate: number
	text: string
	description: string
	author: string
	createdAt: string
	user: {
		username: string
	}
	productId: {
		_id: string
		name: string
	}
}

export interface FeedbackResponse {
	items: Feedback[]
	page: number
	limit: number
	total: number
	totalPages: number
}

export interface SubmitReviewData {
	goodId: string
	rating: number
	text: string
}

// КЛІЄНТСЬКИЙ FETCH

export const getGoodByIdClient = async (id: string): Promise<Good> => {
	const { data } = await nextServer.get<Good>(`/goods/${id}`)
	return data
}

export const getFeedbackByGoodIdClient = async (id: string, page: number, limit: number): Promise<FeedbackResponse> => {
	const { data } = await nextServer.get<FeedbackResponse>(`/feedbacks`, {
		params: { productId: id, page, limit },
	})

	console.log("f-cl", data)
	return data
}

export const postFeedback = async (data: SubmitReviewData): Promise<Feedback> => {
	const isSessionValid = await checkSession()
	if (isSessionValid) {
		const { data: newFeedback } = await nextServer.post<Feedback>("/feedback", data)
		return newFeedback
	} else {
		throw new Error(JSON.stringify({ message: "Session expired or not found", code: 401 }))
	}
}

export const addToCart = async (goodId: string, size: string, color?: string): Promise<void> => {
	const isSessionValid = await checkSession()
	if (isSessionValid) {
		// Припускаємо, що ендпоінт для кошика - /basket
		await nextServer.post("/basket", { goodId, size, color, quantity: 1 })
	} else {
		throw new Error(JSON.stringify({ message: "Session expired or not found", code: 401 }))
	}
}
