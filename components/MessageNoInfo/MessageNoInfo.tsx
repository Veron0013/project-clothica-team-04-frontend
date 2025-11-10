// components/MessageNoInfo/MessageNoInfo.tsx

"use client"

import React from "react"
import { useRouter } from "next/navigation"
import css from "./MessageNoInfo.module.css"

interface MessageNoInfoProps {
	text: string
	buttonText: string
	route?: string // '/goods' | '/categories'
}

export default function MessageNoInfo({ text, buttonText, route = "/goods" }: MessageNoInfoProps) {
	const router = useRouter()

	const handleClick = () => {
		router.push(route)
	}

	return (
		<div className={css["message__container"]}>
			<p className={css["message-text"]}>{text}</p>
			<button onClick={handleClick} className={css["message-button"]}>
				{buttonText}
			</button>
		</div>
	)
}
