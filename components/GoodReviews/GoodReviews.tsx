"use client";

import React, { useState } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getFeedbackByGoodIdClient,
  type FeedbackResponse,
} from "@/lib/productsServise";

import Loader from "@/app/loading";
import ProductRewiews from "../LastReviews/ProductRewiews";
import ReviewModal from "@/components/ReviewModal/ReviewModal";

import styles from "./GoodReviews.module.css";

interface GoodReviewsProps {
  goodId: string;
  reviewsPerPage: number;
}

export default function GoodReviews({
  goodId,
  reviewsPerPage,
}: GoodReviewsProps) {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isPlaceholderData } =
    useQuery<FeedbackResponse>({
      queryKey: ["goodReviews", goodId, page],
      queryFn: () => getFeedbackByGoodIdClient(goodId, page, reviewsPerPage),
      placeholderData: keepPreviousData,
    });

  if (isLoading) return <Loader />;

  if (isError) {
    return <p className={styles.error}>Не вдалося завантажити відгуки.</p>;
  }

  const feedbacks = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const totalFeedbacks = data?.total || 0;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitted = () => {
    // після успішного відгуку:
    // - закриваємо модалку
    // - скидаємо сторінку на 1
    // - перезавантажуємо список відгуків
    setIsModalOpen(false);
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["goodReviews", goodId] });
  };

  return (
    <section className={styles.reviewsSection} id="reviews">
      <div className={styles.header}>
        <h2 className={styles.title}>
          Відгуки <span className={styles.count}>({totalFeedbacks})</span>
        </h2>

        <button
          className={styles.writeBtn}
          type="button"
          onClick={handleOpenModal}
        >
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
                      setPage((old) => old + 1);
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

      {/* 🔽 Наша модалка відгуку */}
      <ReviewModal
        open={isModalOpen}
        onClose={handleCloseModal}
        productId={goodId}
        onSubmitted={handleSubmitted}
      />
    </section>
  );
}
