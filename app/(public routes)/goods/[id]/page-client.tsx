import React, { useState } from "react"

function ProductPage() {
	const [isModalFeedbackOpen, setIsModalFeedbackOpen] = useState(false)

	const handleFeedback = () => {}
	const handleBasket = () => {}
	const handleBasketOpen = () => {}
	return (
		<div>
			<div>ТОВАР </div>
			<button onClick={handleFeedback}>FEEDBACK</button>
			<button onClick={handleBasket}>AddToBasket</button>
			<button onClick={handleBasketOpen}>OpenBasket</button>
		</div>
	)
}

export default ProductPage
