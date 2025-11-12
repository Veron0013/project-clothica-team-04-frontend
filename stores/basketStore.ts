import { create } from "zustand";

type Good = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
};

type BasketState = {
  goods: Good[];
  addGood: (good: Good) => void;
  removeGood: (id: string | number) => void;
  clearBasket: () => void;
};

export const useBasket = create<BasketState>((set) => ({
  goods: [],

  addGood: (good) =>
    set((state) => {
      const existing = state.goods.find((g) => g.id === good.id);
      if (existing) {
        return {
          goods: state.goods.map((g) =>
            g.id === good.id
              ? { ...g, quantity: g.quantity + good.quantity }
              : g
          ),
        };
      }
      return { goods: [...state.goods, good] };
    }),

  removeGood: (id) =>
    set((state) => ({
      goods: state.goods.filter((g) => g.id !== id),
    })),

  clearBasket: () => set({ goods: [] }),
}));
