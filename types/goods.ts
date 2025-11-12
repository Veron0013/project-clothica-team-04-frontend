export type GoodCategory = {
	_id: string
	name: string
	image: string
}

export type Good = {
	_id: string
	//title: string
	name: string
	price: number
	image: string
	currency: string
	color?: string[]
	size: string[]
	characteristics: string[]
	gender: string
	//rating?: number
	//reviewsCount?: number
	category?: GoodCategory
	prevDescription?: string
	feedbackCount?: number
	averageRating?: number
}

export type BasketStoreGood = {
	_id: string
	name: string
	price: number
	image: string
	currency: string
	feedbackCount?: number
	averageRating?: number
	quantity?: number
}

export type GoodsResponse = {
	goods: Good[]
	page: number
	perPage: number
	totalGoods: number
	totalPages: number
}

export type GoodsQuery = {
	category?: string
	size?: string[]
	color?: string[]
	gender?: string
	perPage: number
	page: number
}
