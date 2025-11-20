import { create } from 'zustand';

interface UIState {
  cartIconEl: HTMLElement | null;
  setCartIconEl: (el: HTMLElement | null) => void;
}

export const useUIStore = create<UIState>(set => ({
  cartIconEl: null,
  setCartIconEl: el => set({ cartIconEl: el }),
}));
