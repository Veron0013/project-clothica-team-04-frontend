import { useState, useEffect } from "react"

export function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const fetchQuery = async () => {
			if (typeof window === "undefined") return // SSR-safe
			const media = window.matchMedia(query)
			setMatches(media.matches)

			const listener = () => setMatches(media.matches)
			media.addEventListener("change", listener)
			return () => media.removeEventListener("change", listener)
		}
		fetchQuery()
	}, [query])

	return matches
}
