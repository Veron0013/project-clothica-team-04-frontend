"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import css from "./Header.module.css";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { useAuthStore } from "@/stores/authStore";
import { useBasket } from "@/stores/basketStore";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const { goods } = useBasket();
  const basketCount = goods.reduce((sum, item) => sum + item.quantity, 0);
  // ✅ якщо стор уже каже, що логін виконано — вважаємо, що можна рендерити одразу
  const ready = authChecked || isAuthenticated;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/users/me`, { credentials: "include" });
        if (!res.ok) throw new Error();
        const me = await res.json();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) clearIsAuthenticated();
      } finally {
        if (!cancelled) setAuthChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setUser, clearIsAuthenticated]);

  // невеликий QoL: якщо стан вже став isAuthenticated=true (з форми) — не чекай fetch
  useEffect(() => {
    if (isAuthenticated) setAuthChecked(true);
  }, [isAuthenticated]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

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
              <Link href="/">Головна</Link>
            </li>
            <li>
              <Link href="/goods">Товари</Link>
            </li>
            <li>
              <Link href="/categories">Категорії</Link>
            </li>
          </ul>

          <div className={css.auth}>
            {!ready ? null : isAuthenticated ? (
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
                {basketCount > 0 && (<span className={css.badge}>{basketCount}</span>)}
              </button>
            </div>
          </div>
        </div>

        <BurgerMenu menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </header>
  );
}
