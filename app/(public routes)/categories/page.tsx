"use client"

import React, { useState, useEffect } from "react"
//import CategoriesList from "@/components/CategoriesList/CategoriesList"
import { Category } from "@/lib/api/clientApi" // Наш імітований запит

const CategoriesPage = () => {
	const [categories, setCategories] = useState<Category[]>([]) // усі категорії
	const [totalCategories, setTotalCategories] = useState(0) // кількість категорій
	const [isLoading, setIsLoading] = useState(false)

	const INITIAL_LIMIT = 6 // початок
	const ADDITION_LIMIT = 3 // додавання

	const handleLoadMore = async () => {
		setIsLoading(true)

		const currentShow = categories.length

		const response = { data: { categories: [] } }

		//  не заміняю старі категорії, а додаю до них нові.
		setCategories((prevCategories) => [...prevCategories, ...response.data.categories])

		setIsLoading(false)
	}

	// Кнопку ховати : при загрузці та коли завантажили всі доступні категорії
	const shouldShowButton = !isLoading && categories.length < totalCategories

	return (
		<div>
			<h1>Категорії</h1>
			<p>поки без стілізаціі - перевірка що все працює</p>

			{/*<CategoriesList categories={categories} />*/}

			{isLoading && <p>Завантаження...</p>}

			{shouldShowButton && (
				<button type="button" onClick={handleLoadMore}>
					Показати більше
				</button>
			)}
		</div>
	)
}

export default CategoriesPage
