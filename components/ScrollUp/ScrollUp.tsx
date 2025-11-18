import { useEffect, useState } from "react"
import css from "./ScrollUp.module.css"

const SCROLL_THRESHOLD = 300

export default function ScrollUp() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		// 1️⃣ Вибираємо scrollable контейнер
		const scrollContainer = document.querySelector("main-layout") || window

		const handleScroll = () => {
			const scrollTop = scrollContainer === window ? window.scrollY : (scrollContainer as HTMLElement).scrollTop

			setVisible(scrollTop > SCROLL_THRESHOLD)
		}

		scrollContainer.addEventListener("scroll", handleScroll)
		return () => scrollContainer.removeEventListener("scroll", handleScroll)
	}, [])

	const handleClick = () => {
		const scrollContainer = document.querySelector("main-layout") || window

		if (scrollContainer === window) {
			window.scrollTo({ top: 0, behavior: "smooth" })
		} else {
			;(scrollContainer as HTMLElement).scrollTo({ top: 0, behavior: "smooth" })
		}
	}

	if (!visible) return null

	return (
		<div className={css.scroller} onClick={handleClick}>
			<svg className={css.scrollSvg} width="40" height="40">
				<use href="/sprite.svg#keyboard_arrow_up" />
			</svg>
		</div>
	)
}
