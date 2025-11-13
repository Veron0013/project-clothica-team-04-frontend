"use client"

import React, { useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getFeedbackByGoodIdClient } from "@/lib/productsServise"
import { FeedbackResponse } from "@/lib/productsServise"
// import ReviewsList from '../ReviewsList/ReviewsList';
import Loader from "@/app/loading"
// import ReviewModal from '../ReviewModal/ReviewModal'; // Припустимо, що він тут
import styles from "./GoodReviews.module.css"
import ProductRewiews from "../LastReviews/ProductRewiews"

interface GoodReviewsProps {
	goodId: string
	reviewsPerPage: number
}

export default function GoodReviews({ goodId, reviewsPerPage }: GoodReviewsProps) {
	const [page, setPage] = useState(1)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const { data, isLoading, isError, isPlaceholderData } = useQuery<FeedbackResponse>({
		queryKey: ["goodReviews", goodId, page],
		queryFn: () => getFeedbackByGoodIdClient(goodId, page, reviewsPerPage),
		placeholderData: keepPreviousData,
		//placeholderData: (previousData) => previousData, // Для плавного переходу між сторінками
		//staleTime: 1000 * 60 * 5,
	})

	if (isLoading) return <Loader />

	// Якщо помилка або відгуків немає взагалі (і це перша сторінка)
	if (isError) return <p className={styles.error}>Не вдалося завантажити відгуки.</p>

	const feedbacks = data?.items || []
	const totalPages = data?.totalPages || 1
	const totalFeedbacks = data?.total || 0

	return (
		<section className={styles.reviewsSection} id="reviews">
			<div className={styles.header}>
				<h2 className={styles.title}>
					Відгуки <span className={styles.count}>({totalFeedbacks})</span>
				</h2>

				<button className={styles.writeBtn} onClick={() => setIsModalOpen(true)}>
					Написати відгук
				</button>
			</div>

			<div className={styles.content}>
				{feedbacks.length > 0 ? (
					<>
						<ProductRewiews reviews={feedbacks} />

						{totalPages > 1 && (
							<div className={styles.pagination}>
								<button
									className={styles.pageBtn}
									onClick={() => setPage((old) => Math.max(old - 1, 1))}
									disabled={page === 1}
								>
									Назад
								</button>
								<span className={styles.pageInfo}>
									Сторінка {page} з {totalPages}
								</span>
								<button
									className={styles.pageBtn}
									onClick={() => {
										if (!isPlaceholderData && page < totalPages) {
											setPage((old) => old + 1)
										}
									}}
									disabled={isPlaceholderData || page === totalPages}
								>
									Далі
								</button>
							</div>
						)}
					</>
				) : (
					<div className={styles.noReviews}>
						<p>Ще немає відгуків про цей товар. Будьте першим!</p>
					</div>
				)}
			</div>

			{/* Модальне вікно додавання відгуку */}
			{/* {<ReviewModal 
          isOpen={isModalOpen} 
          goodId={goodId} 
          onClose={() => setIsModalOpen(false)} 
        />
      } */}
		</section>
	)
}
