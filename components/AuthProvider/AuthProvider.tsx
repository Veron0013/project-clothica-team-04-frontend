'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { checkSession, getUsersMe } from '@/lib/api/clientApi';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasHydrated = useAuthStore(s => s.hasHydrated);
  //const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const clear = useAuthStore(s => s.clearIsAuthenticated);

  useEffect(() => {
    //console.log('AuthProvider user:', user);
    if (!hasHydrated) return;

    const initializeAuth = async () => {
      try {
        await checkSession();
        const me = await getUsersMe();
        // console.log('AuthProvider user:', me);
        setUser(me);
      } catch (e) {
        //console.log('AuthProvider error:', e);
        clear();
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, setUser, clear]);

  return <>{children}</>;
}
