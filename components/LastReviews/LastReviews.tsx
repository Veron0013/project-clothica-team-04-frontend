"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import css from "./LastReviews.module.css";
import { getReviews } from "@/lib/api/reviewsApi";

interface Review {
  _id?: string;
  author?: string;
  description?: string;
  rate?: number;
  productId?: { name: string };
}

export default function LastReviews() {
  const { data: reviews = [], isLoading, isError } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

  const swiperRef = useRef<SwiperClass | null>(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
    return;
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <h2 className={css.title}>Останні відгуки</h2>

        {isLoading ? (
          <p>Завантаження...</p>
        ) : isError ? (
          <p>Не вдалося отримати відгуки</p>
        ) : (
          <>
            <Swiper
              modules={[Navigation, Keyboard, A11y]}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              keyboard={{ enabled: true }}
              spaceBetween={34}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1440: { slidesPerView: 3 },
              }}
              className={css.swiper}
            >
              {reviews.map((item) => (
                <SwiperSlide key={item._id} className={css.item}>
                  <div className={css.stars}>
                    {Array.from({ length: 5 }, (_, index) => {
                      const diff = (item.rate ?? 0) - index;
                      if (diff >= 1) {
                        return (
                          <svg
                            key={index}
                            width="20"
                            height="20"
                            className={css.starFull}
                          >
                            <use href="/sprite.svg#star-filled" />
                          </svg>
                        );
                      } else if (diff > 0) {
                        return (
                          <span key={index} className={css.starPartialWrapper}>
                            <svg
                              width="20"
                              height="20"
                              className={css.starEmpty}
                            >
                              <use href="/sprite.svg#star" />
                            </svg>
                            <span
                              className={css.starPartialFill}
                              style={{ width: `${diff * 100}%` }}
                            >
                              <svg
                                width="20"
                                height="20"
                                className={css.starFull}
                              >
                                <use href="/sprite.svg#star-filled" />
                              </svg>
                            </span>
                          </span>
                        );
                      } else {
                        return (
                          <svg
                            key={index}
                            width="20"
                            height="20"
                            className={css.starEmpty}
                          >
                            <use href="/sprite.svg#star" />
                          </svg>
                        );
                      }
                    })}
                  </div>

                  <p className={css.text}>{item.description || ""}</p>
                  <p className={css.name}>{item.author || "Анонім"}</p>
                  <p className={css.product}>{item.productId?.name || "—"}</p>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* PAGINATION BUTTONS */}
            <div className={css.controls}>
              <button
                type="button"
                className={css.btnPrev}
                onClick={handlePrev}
                disabled={isBeginning}
                aria-label="Попередні відгуки"
              >
                <svg width={24} height={24}>
                  <use href="/sprite.svg#arrow_back" />
                </svg>
              </button>

              <button
                type="button"
                className={css.btnNext}
                onClick={handleNext}
                disabled={isEnd}
                aria-label="Наступні відгуки"
              >
                <svg width={24} height={24}>
                  <use href="/sprite.svg#arrow_forward" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}