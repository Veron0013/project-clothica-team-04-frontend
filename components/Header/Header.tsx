"use client";

import { useState, useEffect } from "react";
import css from "./Header.module.css";
import BurgerMenu from "../BurgerMenu/BurgerMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            <a href="">Головна</a>
          </li>
          <li>
            <a href="">Товари</a>
          </li>
          <li>
            <a href="">Категорії</a>
          </li>
        </ul>
        <div className={css.auth}>
          <a href="" className={css.navUp}>
            Вхід
          </a>
          <a href="" className={css.navIn}>
            Реєстрація
          </a>
          {/* <a href="" className={css.navUpBasket}>
            Кабінет
          </a> */}
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
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
          <BurgerMenu menuOpen={menuOpen}/>
      )}
    </div>
  );
}
