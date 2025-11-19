'use client';

import { useState, FormEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './ReviewModal.module.css';
import { StarBtn } from '../StarBtn/StarBtn';
import type { FeedbackPayload } from '@/types/feedback';

import toastMessage, { MyToastType } from '@/lib/messageService';
import { createFeedbackClient } from '@/lib/api/reviewsApi';

type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
  productId: string;
  category?: string;
  onSubmitted?: () => void;
};

export default function ReviewModal({
  open,
  onClose,
  productId,
  category,
  onSubmitted,
}: ReviewModalProps) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled =
    submitting ||
    !name.trim() ||
    !text.trim() ||
    rating < 1 ||
    rating > 5 ||
    !productId;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload: FeedbackPayload = {
        author: name.trim(),
        rate: Number(rating.toFixed(1)),
        comment: text.trim(),
        goodId: productId,
        category: category ?? '',
      };

      await createFeedbackClient(payload);

      toastMessage(MyToastType.success, 'Дякуємо! Відгук надіслано.');
      onSubmitted?.();

      setName('');
      setText('');
      setRating(0);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.message || 'Сталася помилка під час надсилання відгуку';
      setError(msg);
      toastMessage(MyToastType.error, msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ESC + блокування скролу
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (typeof document === 'undefined') return null;
  if (!open) return null;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
      onClick={handleBackdropClick}
    >
      <div className={css.container}>
        <button
          type="button"
          className={css.closeBtn}
          aria-label="Закрити модальне вікно"
          onClick={onClose}
        >
          <svg
            className={css.closeIcon}
            width="32"
            height="32"
            aria-hidden="true"
          >
            <use href="/sprite.svg#close"></use>
          </svg>
        </button>

        <h2 id="review-title" className={css.title}>
          Залишити відгук
        </h2>

        <form className={css.form} onSubmit={handleSubmit} noValidate>
          <label className={css.field}>
            <span className={css.label}>Ваше імʼя</span>
            <input
              className={css.input}
              type="text"
              placeholder="Ваше імʼя"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>

          <label className={css.field}>
            <span className={css.label}>Відгук</span>
            <textarea
              className={css.textarea}
              rows={5}
              placeholder="Ваш відгук"
              value={text}
              onChange={e => setText(e.target.value)}
              required
            />
          </label>

          <div className={css.ratingRow} aria-label="Оцінка">
            {[1, 2, 3, 4, 5].map(n => (
              <StarBtn
                key={n}
                value={n}
                active={rating >= n}
                onClick={setRating}
              />
            ))}
          </div>

          {error && <p className={css.error}>{error}</p>}

          <button className={css.submit} type="submit" disabled={isDisabled}>
            {submitting ? 'Надсилаю…' : 'Надіслати'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
