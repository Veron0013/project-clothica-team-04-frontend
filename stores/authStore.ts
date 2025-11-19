import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setUser: (u: User | null) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuthenticated: false,
      user: null,

      hasHydrated: false,
      setHasHydrated: v => set({ hasHydrated: v }),

      setUser: user => set({ user, isAuthenticated: Boolean(user) }),

      clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-store',
      skipHydration: false,
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    }
  )
);
