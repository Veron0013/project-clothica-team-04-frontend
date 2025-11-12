import { Good } from "@/types/goods"
import { create } from "zustand"

type BasketGood = {
	id: Good["_id"]
	name: string
	price: number
	quantity: number
}

type BasketState = {
	goods: BasketGood[]
	addGood: (good: BasketGood) => void
	removeGood: (id: BasketGood["id"]) => void
	decrementGood: (id: BasketGood["id"]) => void
	updateGoodQuantity: (id: BasketGood["id"], quantity: number) => void
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
			return { goods: [...state.goods, { ...good, quantity: 1 }] }
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
