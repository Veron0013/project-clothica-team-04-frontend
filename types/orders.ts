export interface OrderItem {
	productId: string
	name?: string
	price: number
	currency?: string
	image?: string
	quantity: number
	totalPrice?: number
	feedbackCount?: number
	averageRating?: number
}

export interface DeliveryDetails {
	fullName: string
	phone: string
	address: string
}

export interface Order {
	_id?: string
	orderNumber?: string
	userId: string | null
	items: OrderItem[]
	totalAmount: number
	status?: "У процесі" | "Комплектується" | "Відвантажено" | "Виконано" | "Скасовано" | string
	deliveryDetails: DeliveryDetails
	totalPrice?: number
	comment?: string
	currency?: string
	createdAt?: string // або Date, якщо перетворювати після fetch
	updatedAt?: string // або Date
}
