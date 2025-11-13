"use client";

import { useState, FormEvent } from "react";
import Modal from "@/components/Modal/Modal";
import css from "./ReviewModal.module.css";
import { StarBtn } from "../StarBtn/StarBtn";
import type { FeedbackPayload } from "@/types/feedback";
import { createFeedbackClient } from "@/lib/api/clientApi";
import toastMessage, { MyToastType } from "@/lib/messageService";

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
  const [name, setName] = useState("");
  const [text, setText] = useState("");
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
        category: category ?? "",
      };

      await createFeedbackClient(payload);

      toastMessage(MyToastType.success, "Дякуємо! Відгук надіслано.");
      onSubmitted?.();

      setName("");
      setText("");
      setRating(0);
      onClose();
    } catch (err: any) {
      const msg = err?.message || "Сталася помилка під час надсилання відгуку";
      setError(msg);
      toastMessage(MyToastType.error, msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabelledby="review-title">
      <div className={css.container}>
        <h2 id="review-title" className={css.title}>
          Залишити відгук
        </h2>

        <button
          type="button"
          className={css.closeBtn}
          aria-label="Закрити модальне вікно"
          onClick={onClose}
        >
          <svg width="32" height="32" aria-hidden="true">
            <use href="/sprite.svg#close"></use>
          </svg>
        </button>

        <form className={css.form} onSubmit={handleSubmit} noValidate>
          <label className={css.field}>
            <span className={css.label}>Ваше імʼя</span>
            <input
              className={css.input}
              type="text"
              placeholder="Ваше імʼя"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setText(e.target.value)}
              required
            />
          </label>

          <div className={css.ratingRow} aria-label="Оцінка">
            {[1, 2, 3, 4, 5].map((n) => (
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
            {submitting ? "Надсилаю…" : "Надіслати"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
