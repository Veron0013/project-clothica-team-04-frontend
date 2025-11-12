"use client"

import { useState, useEffect } from "react"
import css from "./Header.module.css"
import BurgerMenu from "../BurgerMenu/BurgerMenu"
import Link from "next/link"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "next/navigation"

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false)
	const router = useRouter()
	const user = useAuthStore((state) => state.user)
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = ""
		}
	}, [menuOpen])

	return (
		<header className={css.section}>
			<div className="container">
				<div className={css.header}>
					<a href="" className={css.logo}>
						<svg width="84" height="36" aria-label="Clothica logo">
							<use href="/sprite.svg#icon-company-logo" />
						</svg>
					</a>
					<ul className={css.nav}>
						<li>
							<Link href="/" aria-label="Home page">
								Головна
							</Link>
						</li>
						<li>
							<Link href="/goods">Товари</Link>
						</li>
						<li>
							<Link href="/categories">Категорії</Link>
						</li>
					</ul>
					<div className={css.auth}>
						{!isAuthenticated ? (
							<>
								<Link href="/sign-in" className={css.navUp}>
									Вхід
								</Link>
								<Link href="/sign-up" className={css.navIn}>
									Реєстрація
								</Link>
							</>
						) : (
							<Link href="/profile" className={css.navUpBasket}>
								Кабінет
							</Link>
						)}
						<div className={css.navCont}>
							<button className={css.burger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Відкрити меню">
								<svg width="24" height="24">
									<use href={`/sprite.svg#${menuOpen ? "close" : "menu"}`} />
								</svg>
							</button>
							<button className={css.basket} onClick={() => router.push("/basket")}>
								<svg width="24" height="24">
									<use href="/sprite.svg#shopping_cart" />
								</svg>
								<span className={css.badge}>1</span>
							</button>
						</div>
					</div>
				</div>

				{<BurgerMenu menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />}
			</div>
		</header>
	)
}
