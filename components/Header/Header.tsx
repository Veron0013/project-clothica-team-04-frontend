'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import css from './Header.module.css';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import { useAuthStore } from '@/stores/authStore';
import { useBasket } from '@/stores/basketStore';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import { getUsersMe } from '@/lib/api/clientApi';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  // Zustand
  const hasHydrated = useAuthStore(s => s.hasHydrated);
  //const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const clearIsAuthenticated = useAuthStore(s => s.clearIsAuthenticated);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const goods = useBasket(s => s.goods);
  const basketCount = goods.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!hasHydrated) return;

    const verify = async () => {
      try {
        const data = await getUsersMe();
        setUser(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        clearIsAuthenticated();
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, isAuthenticated]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!hasHydrated) {
    return null; // або skeleton
  }

  return (
    <header className={css.section}>
      <div className="container">
        <div className={css.header}>
          <Link href="/" className={css.logo} aria-label="Clothica logo">
            <svg width="84" height="36" aria-hidden="true">
              <use href="/sprite.svg#icon-company-logo" />
            </svg>
          </Link>

          <ul className={css.nav}>
            <li>
              <Link className={css.link} href="/">
                Головна
              </Link>
            </li>
            <li>
              <Link className={css.link} href="/goods">
                Товари
              </Link>
            </li>
            <li>
              <Link className={css.link} href="/categories">
                Категорії
              </Link>
            </li>
          </ul>

          <ThemeToggle />

          <div className={css.auth}>
            {isAuthenticated ? (
              <Link href="/profile" className={css.navUpBasket}>
                Кабінет
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className={css.navUp}>
                  Вхід
                </Link>
                <Link href="/sign-up" className={css.navIn}>
                  Реєстрація
                </Link>
              </>
            )}

            <div className={css.navCont}>
              <button
                className={css.burger}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Відкрити меню"
              >
                <svg width="24" height="24">
                  <use href={`/sprite.svg#${menuOpen ? 'close' : 'menu'}`} />
                </svg>
              </button>

              <button
                className={css.basket}
                onClick={() => router.push('/basket')}
                aria-label="Кошик"
              >
                <svg width="24" height="24">
                  <use href="/sprite.svg#shopping_cart" />
                </svg>
                {basketCount > 0 && (
                  <span className={css.badge}>{basketCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        <BurgerMenu menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </header>
  );
}
