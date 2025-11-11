// components/Filters/FilterItem.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { startTransition, useState } from "react"
import css from "./Filter.module.css"
import Link from "next/link"

export default function FilterItem({
	name,
	value,
	label,
	onClose,
}: {
	name: string
	value: string
	label: string
	onClose?: () => void
}) {
	const pathname = usePathname()
	const router = useRouter()
	const sp = useSearchParams()
	const [pending, setPending] = useState(false)

	// Поточне значення (припускаємо single-select для простоти)
	const current = sp.get(name)
	const isActive = current === value

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault()
		if (pending) return

		// Скопіюємо searchParams
		const next = new URLSearchParams(sp.toString())

		if (isActive) {
			next.delete(name) // зняти фільтр
		} else {
			next.set(name, value) // встановити фільтр (single)
		}

		// Якщо потрібно - можна видаляти page/offset при зміні фільтра:
		next.delete("page")

		const href = `${pathname}${next.toString() ? "?" + next.toString() : ""}`

		// client-side navigation + pending indicator
		setPending(true)
		startTransition(() => {
			// router.push повертає проміс, але startTransition достатній для ререндеру
			router.push(href)
		})
		// optional: reset pending shortly after navigation started
		setTimeout(() => setPending(false), 1500)

		// закриваємо модалку на мобільних (якщо потрібно)
		if (onClose) onClose()
	}

	return (
		<li className={css.filter__item}>
			<Link
				href="#"
				onClick={handleClick}
				className={`${css.filter__link} ${isActive ? css.filter__link_active : ""} ${
					pending ? css.filter__link_disabled : ""
				}`}
				aria-pressed={isActive}
				aria-disabled={pending}
			>
				{label}
			</Link>
		</li>
	)
}
