'use client';

import React, { useState } from 'react';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getFeedbackByGoodIdClient,
  type FeedbackResponse,
} from '@/lib/productsServise';

import Loader from '@/app/loading';
import ProductRewiews from '../LastReviews/ProductRewiews';
import ReviewModal from '@/components/ReviewModal/ReviewModal';

import css from './GoodReviews.module.css';
import reviewStyles from '@/components/LastReviews/LastReviews.module.css';

interface GoodReviewsProps {
  productId: string;
  reviewsPerPage: number;
}

export default function GoodReviews({
  productId,
  reviewsPerPage,
}: GoodReviewsProps) {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isPlaceholderData } =
    useQuery<FeedbackResponse>({
      queryKey: ['goodReviewsById', productId, page],
      queryFn: () => getFeedbackByGoodIdClient(productId, page, reviewsPerPage),
      placeholderData: keepPreviousData,
    });

  if (isLoading) return <Loader />;

  if (isError) {
    return <p className={css.error}>Не вдалося завантажити відгуки.</p>;
  }

  const feedbacks = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitted = () => {
    setIsModalOpen(false);
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ['goodReviewsById', productId] });
  };

  // Функції керування пагінацією
  const handlePrevPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(totalPages, prev + 1));
  };

  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;

  return (
    <section className={css.reviewsSection} id="reviews">
      <div className={css.header}>
        <h2 className={css.title}>Відгуки клієнтів</h2>

        <button
          className={css.writeBtn}
          type="button"
          onClick={handleOpenModal}
        >
          Залишити відгук
        </button>
      </div>

      <div className={css.content}>
        {feedbacks.length > 0 ? (
          <>
            <ProductRewiews reviews={feedbacks} />

            {totalPages > 1 && (
              <div className={reviewStyles.controls}>
                <button
                  type="button"
                  className={reviewStyles.btnPrev}
                  onClick={handlePrevPage}
                  disabled={isFirstPage || isPlaceholderData}
                  aria-label="Попередня сторінка відгуків"
                >
                  <svg width={24} height={24}>
                    <use href="/sprite.svg#arrow_back" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={reviewStyles.btnNext}
                  onClick={handleNextPage}
                  disabled={isLastPage || isPlaceholderData}
                  aria-label="Наступна сторінка відгуків"
                >
                  <svg width={24} height={24}>
                    <use href="/sprite.svg#arrow_forward" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={css.noReviews}>
            <p className={css.noReviewsText}>
              Ще немає відгуків про цей товар. Будьте першим!
            </p>

            <button
              className={css.writeBtnNoReviews}
              type="button"
              onClick={handleOpenModal}
            >
              Залишити відгук
            </button>
          </div>
        )}
      </div>

      {/* 🔽 Наша модалка відгуку */}
      <ReviewModal
        open={isModalOpen}
        onClose={handleCloseModal}
        productId={productId}
        onSubmitted={handleSubmitted}
      />
    </section>
  );
}
