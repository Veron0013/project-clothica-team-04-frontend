export interface OrderItem {
	productId: string
	name: string
	price: number
	currency: string
	image: string
	quantity: number
	totalPrice: number
	feedbackCount: number
	averageRating: number
}

export interface DeliveryDetails {
	fullName: string
	phone: string
	address: string
}

export interface Order {
	_id: string
	userId: string | null
	orderNumber: string
	totalAmount: number
	status: "in_process" | "completed" | "canceled" | "assembling" | string;
	deliveryDetails: DeliveryDetails
	createdAt: string // або Date, якщо перетворювати після fetch
	updatedAt: string // або Date
	items: OrderItem[]
	totalPrice: number;
	currency: string;
}
