"use client";

import css from "./PopularCategories.module.css";
import Link from "next/link";
import { useRef, useState, useMemo } from "react";
import { type GoodCategory } from "@/types/goods";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Keyboard, Pagination } from "swiper/modules";
import { fetchPopularCategories } from "@/lib/api/mainPageApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

type PopularCategoriesProps = {
  initialData: {
    categories: GoodCategory[];
    page: number;
    totalPages: number;
    limit?: number;
    totalCategories?: number;
  };
};

export default function PopularCategories({
  initialData,
}: PopularCategoriesProps) {
  const limit = initialData.limit ?? 4;

  const seed = {
    ...initialData,
    limit,
    totalCategories:
      initialData.totalCategories ??
      (initialData.totalPages > 1
        ? (initialData.totalPages - 1) * limit + initialData.categories.length
        : initialData.categories.length),
  };

  const {
    data,
    fetchNextPage,
    hasNextPage: _hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["popularCategories"],
    initialPageParam: seed.page,
    queryFn: ({ pageParam }) =>
      fetchPopularCategories({ page: pageParam as number, limit }),
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    initialData: {
      pages: [seed],
      pageParams: [seed.page],
    },
  });

  const categories = useMemo(() => {
    const list = (data?.pages ?? []).flatMap((p) => p.categories);
    const seen = new Set<string>();
    return list.filter((c) =>
      seen.has(c._id) ? false : (seen.add(c._id), true)
    );
  }, [data]);

  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const hasNextPage = !!_hasNextPage;
  const isPrevDisabled = isBeginning;
  const isNextDisabled = isEnd && !hasNextPage;

  const handlePrev = () => swiperRef.current?.slidePrev();

  const handleNext = async () => {
    const s = swiperRef.current;
    if (!s) return;

    if (s.isEnd && hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      s.update();
      s.slideNext();
      return;
    }
    s.slideNext();
  };

  return (
    <section id="popular-categories" className={css.categories}>
      <div className={css.container}>
        <div className={css.nav}>
          <h2 className={css.title}>Популярні категорії</h2>
          <Link href="/categories" className={css.allCatBtn}>
            Всі категорії
          </Link>
        </div>

        <div className={css.sliderWrapper}>
          <Swiper
            modules={[Keyboard, Pagination]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            keyboard={{ enabled: true }}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1440: { slidesPerView: 3 },
            }}
            className={css.swiper}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat._id} className={css.slideCard}>
                <Link href={`/goods?category=${cat._id}`}>
                  <div className={css.thumb}>
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(min-width:1440px) 33vw, (min-width:768px) 50vw, 100vw"
                      className={css.img}
                    />
                  </div>
                  <h3 className={css.cardTitle}>{cat.name}</h3>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            className={`${css.navBtn} ${css.navPrev} ${
              isPrevDisabled ? css.navBtnDisabled : ""
            }`}
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="Попередні товари"
          >
            <svg className={css.icon} width={24} height={24}>
              <use href="/sprite.svg/#arrow_back" />
            </svg>
          </button>
          <button
            type="button"
            className={`${css.navBtn} ${css.navNext} ${
              isNextDisabled || isFetchingNextPage ? css.navBtnDisabled : ""
            }`}
            onClick={handleNext}
            disabled={isNextDisabled || isFetchingNextPage}
            aria-label="Наступні товари"
          >
            <svg className={css.icon} width={24} height={24}>
              <use href="/sprite.svg/#arrow_forward" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
