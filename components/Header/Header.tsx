"use client";

import { useState, useEffect } from "react";
import css from "./Header.module.css";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <div className={css.container}>
      <header className={css.header}>
        <a href="" className={css.logo}>
          <svg width="84" height="36" aria-label="Clothica logo">
            <use href="/sprite.svg#icon-company-logo" />
          </svg>
        </a>
        <ul className={css.nav}>
          <li>
            <Link href="" aria-label="Home page">Головна</Link>
          </li>
          <li>
            <Link href="">Товари</Link>
          </li>
          <li>
            <Link href="">Категорії</Link>
          </li>
        </ul>
        <div className={css.auth}>
          {!isAuthenticated ? (
            <><Link href="" className={css.navUp}>
            Вхід
          </Link>
          <Link href="" className={css.navIn}>
            Реєстрація
          </Link></>
          ): (<Link href="" className={css.navUpBasket}>
            Кабінет
          </Link>) }
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
            <div className={css.basket}>
              <svg width="24" height="24">
                <use href="/sprite.svg#shopping_cart" />
              </svg>
              <span className={css.badge}>1</span>
            </div>
          </div>
        </div>
      </header>

      {<BurgerMenu menuOpen={menuOpen}/>
      }
    </div>
  );
}
