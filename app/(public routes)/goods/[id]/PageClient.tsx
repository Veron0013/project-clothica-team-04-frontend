// app/(public routes)/goods/page-client.tsx
"use client"

import { useState } from "react"
import ReviewModal from "@/components/ReviewModal/ReviewModal"
import { useBasket } from "@/stores/basketStore"
import { Good } from "@/types/goods"
import BasketModalPage from "@/app/(private routes)/basket/page"

type Props = {
	productId: Good["_id"]
	category?: string
}

export default function PageClient({ productId, category }: Props) {
	const [open, setOpen] = useState(false)
	const [openBasket, setOpenBasket] = useState(false)

	const { goods, addGood } = useBasket()

	const handleBasketClick = () => {
		setOpenBasket(true)
		console.log("basket", goods)
	}

	return (
		<>
			<button onClick={() => setOpen(true)} style={{ padding: "14px 20px", borderRadius: 12, fontWeight: 600 }}>
				Залишити відгук
			</button>
			<button
				onClick={() => addGood({ id: productId, quantity: 1 })}
				style={{ padding: "14px 20px", borderRadius: 12, fontWeight: 600 }}
			>
				додати товар
			</button>
			<button onClick={handleBasketClick} style={{ padding: "14px 20px", borderRadius: 12, fontWeight: 600 }}>
				Кошик (інфа в консолі)
			</button>

			{openBasket && <BasketModalPage /> && <>хЕРА</>}
			<ReviewModal open={open} onClose={() => setOpen(false)} productId={productId} category={category} />
		</>
	)
}
