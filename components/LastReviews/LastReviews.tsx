"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/lib/api/reviewsApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import css from "./LastReviews.module.css";

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

  const [visibleCount, setVisibleCount] = useState(3);
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const loadMore = () => {
    if (hasMore) setVisibleCount((prev) => prev + 3);
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <h2 className={css.title}>Останні відгуки</h2>

        {isLoading ? (
          <p>Завантаження...</p>
        ) : isError ? (
          <p>Не вдалося отримати відгуки </p>
        ) : (
          <Swiper
            modules={[Navigation, Keyboard, A11y, Autoplay]}
            navigation={{
              nextEl: `.${css.btnNext}`,
              prevEl: `.${css.btnPrev}`,
            }}
            keyboard={{ enabled: true }}
            spaceBetween={34}
            slidesPerView={1}
            slidesPerGroup={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: { slidesPerView: 2, slidesPerGroup: 2 },
              1440: { slidesPerView: 3, slidesPerGroup: 3 }
            }}
            className={css.swiper}
            a11y={{ enabled: true }}
          >
            {visibleReviews.map((item, i) => (
              <SwiperSlide key={item._id || i} className={css.item}>
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
                          <svg width="20" height="20" className={css.starEmpty}>
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
        )}

        <div className={css.controls}>
          <button
            type="button"
            className={css.btnPrev}
            aria-label="Попередній слайд"
            disabled={visibleReviews.length === 0}
          >
            <svg width="20" height="20" fill="currentColor">
              <use href="/sprite.svg#arrow_back" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Наступний слайд"
            className={css.btnNext}
            disabled={!hasMore}
            onClick={loadMore}
          >
            <svg width="20" height="20" fill="currentColor">
              <use href="/sprite.svg#arrow_forward" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
