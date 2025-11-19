import { Good } from '@/types/goods';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type StoreGood = {
  key: string;
  id: Good['_id'];
  color?: string;
  size?: string;
  quantity: number;
  price: number;
};

type AddGoodPayload = {
  id: Good['_id'];
  color?: string;
  size?: string;
  quantity?: number;
  price: number;
};

type BasketState = {
  goods: StoreGood[];
  addGood: (good: AddGoodPayload) => void;
  removeGood: (key: StoreGood['key']) => void;
  decrementGood: (key: StoreGood['key']) => void;
  updateGoodQuantity: (key: StoreGood['key'], quantity: number) => void;
  clearBasket: () => void;
};

export const useBasket = create<BasketState>()(
  persist(
    set => {
      const buildGoodKey = (g: { id: string; size?: string; color?: string }) =>
        `${g.id}_${g.size || 'nosize'}_${g.color || 'nocolor'}`;

      return {
        goods: [],

        addGood: good =>
          set(state => {
            const quantityToAdd = good.quantity ?? 1;
            const key = buildGoodKey(good);
            const existing = state.goods.find(g => g.key === key);

            if (existing) {
              return {
                goods: state.goods.map(g =>
                  g.key === key
                    ? { ...g, quantity: g.quantity + quantityToAdd }
                    : g
                ),
              };
            }
            //console.log("ADDING GOOD:", good)
            return {
              goods: [
                ...state.goods,
                { ...good, key, quantity: quantityToAdd, price: good.price },
              ],
            };
          }),

        decrementGood: key =>
          set(state => ({
            goods: state.goods
              .map(g =>
                g.key === key
                  ? { ...g, quantity: Math.max(0, g.quantity - 1) }
                  : g
              )
              .filter(g => g.quantity > 0),
          })),

        updateGoodQuantity: (key, quantity) =>
          set(state => ({
            goods: state.goods.map(g =>
              g.key === key ? { ...g, quantity: Math.max(0, quantity) } : g
            ),
          })),

        removeGood: key =>
          set(state => ({
            goods: state.goods.filter(g => g.key !== key),
          })),

        clearBasket: () => set({ goods: [] }),
      };
    },
    {
      name: 'basket-storage', // ключ у localStorage
    }
  )
);
