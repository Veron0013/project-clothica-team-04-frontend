"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import css from "./Header.module.css";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { useAuthStore } from "@/stores/authStore";
import { useBasket } from "@/stores/basketStore";
import { getMe } from "@/lib/api/clientApi";
import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );
  const { theme, toggleTheme } = useTheme();

  const [authChecked, setAuthChecked] = useState(false);

  const goods = useBasket((state) => state.goods);
  const basketCount = goods.reduce((sum, item) => sum + item.quantity, 0);
  // ✅ якщо стор уже каже, що логін виконано — вважаємо, що можна рендерити одразу
  const ready = authChecked || isAuthenticated;

  //useEffect(() => {
  //	//console.log("fetch", user, isAuthenticated)
  //	//if (isAuthenticated) return setAuthChecked(true)

  //	const fetchCurrentUser = async () => {
  //		try {
  //			const userData = await getMe()
  //			console.log("header-user", userData)
  //			if (!userData) throw new Error()
  //			setUser(userData)
  //		} catch (e) {
  //			console.log("header-error", e)
  //			if (isAuthenticated) clearIsAuthenticated()
  //		} finally {
  //			setAuthChecked(true)
  //		}
  //	}
  //	fetchCurrentUser()
  //}, [isAuthenticated])

  //console.log("after fetch", user, isAuthenticated)
  //// невеликий QoL: якщо стан вже став isAuthenticated=true (з форми) — не чекай fetch
  //useEffect(() => {
  //	//console.log("header-user-effect", isAuthenticated, user)
  //	if (isAuthenticated) setAuthChecked(true)
  //}, [isAuthenticated])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
              <>
                <Link href="/profile" className={css.navUpBasket}>
                  Кабінет
                </Link>
              </>
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
                  <use href={`/sprite.svg#${menuOpen ? "close" : "menu"}`} />
                </svg>
              </button>
              <button
                className={css.basket}
                onClick={() => router.push("/basket")}
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
