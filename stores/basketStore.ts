import { Good } from "@/types/goods"
import { create } from "zustand"

type StoreGood = {
	id: Good["_id"]
	color?: string
	size?: string
	quantity: number
}

type BasketState = {
	goods: StoreGood[]
	addGood: (good: StoreGood) => void
	removeGood: (id: StoreGood["id"]) => void
	decrementGood: (id: StoreGood["id"]) => void
	updateGoodQuantity: (id: StoreGood["id"], quantity: number) => void
	clearBasket: () => void
}

export const useBasket = create<BasketState>((set) => ({
	goods: [],

	addGood: (good) =>
		set((state) => {
			const existing = state.goods.find((g) => g.id === good.id)
			if (existing) {
				return {
					goods: state.goods.map((g) =>
						g.id === good.id
							? { ...g, quantity: g.quantity + 1 } // +1 при натисканні "+"
							: g
					),
				}
			}
			return { goods: [...state.goods, { ...good }] }
		}),

	decrementGood: (id) =>
		set((state) => ({
			goods: state.goods
				.map((g) =>
					g.id === id
						? { ...g, quantity: Math.max(0, g.quantity - 1) } // не нижче 0
						: g
				)
				.filter((g) => g.quantity > 0), // якщо стало 0 — видаляємо
		})),

	updateGoodQuantity: (id, quantity) =>
		set((state) => ({
			goods: state.goods.map((g) => (g.id === id ? { ...g, quantity: Math.max(0, quantity) } : g)),
		})),

	removeGood: (id) =>
		set((state) => ({
			goods: state.goods.filter((g) => g.id !== id),
		})),

	clearBasket: () => set({ goods: [] }),
}))
