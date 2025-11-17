"use client";

import css from "./PopularGoods.module.css";
import Link from "next/link";
import { useRef, useState, useMemo } from "react";
import { type Good } from "@/types/goods";
import HomeGoodInfo from "../HomeGoodInfo/HomeGoodInfo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Navigation, Keyboard } from "swiper/modules";
import { fetchPopularGoods } from "@/lib/api/mainPageApi";
import "swiper/css";
import "swiper/css/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

type PopularGoodsProps = {
  initialData: {
    items: Good[];
    page: number;
    totalPages: number;
    limit: number;
    total: number;
  };
};

const MAX_BULLETS = 5;

export default function PopularGoods({ initialData }: PopularGoodsProps) {
  const limit = initialData.limit ?? 6;

  const seed = {
    ...initialData,
    limit,
  };

  const {
    data,
    fetchNextPage,
    hasNextPage: _hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["popularGoods"],
    initialPageParam: seed.page,
    queryFn: ({ pageParam }) =>
      fetchPopularGoods({ page: pageParam as number, limit }),
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
    initialData: {
      pages: [seed],
      pageParams: [seed.page],
    },
  });

  const goods = useMemo(() => {
    const list = (data?.pages ?? []).flatMap((p) => p.items);
    const seen = new Set<string>();

    return list.filter((item) =>
      seen.has(item._id) ? false : (seen.add(item._id), true)
    );
  }, [data]);

  const swiperRef = useRef<SwiperType | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerViewState, setSlidesPerViewState] = useState(1);
  const [isPaginationReady, setIsPaginationReady] = useState(false);

  const hasNextPage = !!_hasNextPage;

  const updateSlidesPerView = (swiper: SwiperType) => {
    let currentSpv = 1;
    const paramSpv = swiper.params.slidesPerView;

    if (typeof paramSpv === "number") {
      currentSpv = paramSpv;
    }

    setSlidesPerViewState(currentSpv);
  };

  const loadMoreIfNeeded = async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    await fetchNextPage();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);

    swiperRef.current?.update();
  };

  const handlePrev = () => swiperRef.current?.slidePrev();

  const handleNext = async () => {
    const s = swiperRef.current;
    if (!s) return;

    if (s.isEnd) {
      await loadMoreIfNeeded();
    }

    s.slideNext();
  };

  const totalSlides = goods.length;
  const positionsCount = Math.max(1, totalSlides - slidesPerViewState + 1);

  const effectiveActiveIndex = Math.min(activeIndex, positionsCount - 1);

  const isPrevDisabled = effectiveActiveIndex === 0;
  const isNextDisabled =
    !hasNextPage && effectiveActiveIndex >= positionsCount - 1;

  const visibleCount = Math.min(MAX_BULLETS, positionsCount);

  let windowStart = 0;

  if (positionsCount > visibleCount) {
    const middle = Math.floor(visibleCount / 2);

    if (effectiveActiveIndex <= middle) {
      windowStart = 0;
    } else if (effectiveActiveIndex >= positionsCount - middle - 1) {
      windowStart = positionsCount - visibleCount;
    } else {
      windowStart = effectiveActiveIndex - middle;
    }
  }

  const handleBulletClick = (positionIndex: number) => {
    const s = swiperRef.current;
    if (!s) return;

    s.slideTo(positionIndex);
  };

  return (
    <section id="popular-goods" className={css.popularGoods}>
      <div className={css.container}>
        <div className={css.nav}>
          <h2 className={css.title}>Популярні товари</h2>
          <Link className={css.allGoodsBtn} href="/goods">
            Всі товари
          </Link>
        </div>

        <div className={css.sliderWrapper}>
          <Swiper
            modules={[Navigation, Keyboard]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
              updateSlidesPerView(swiper);
              setIsPaginationReady(true);
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
              updateSlidesPerView(swiper);
            }}
            onReachEnd={async () => {
              await loadMoreIfNeeded();
            }}
            keyboard={{ enabled: true }}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1440: { slidesPerView: 4 },
            }}
            className={css.swiper}
          >
            {goods.map((good) => (
              <SwiperSlide tag="ul" key={good._id}>
                <HomeGoodInfo item={good} />
              </SwiperSlide>
            ))}
          </Swiper>

          {isPaginationReady && (
            <div className={css.pagination}>
              {Array.from({ length: visibleCount }).map((_, i) => {
                const positionIndex = windowStart + i;
                const distance = Math.abs(positionIndex - effectiveActiveIndex);

                let dotClass = css.dot;

                if (distance === 0) {
                  dotClass = `${css.dot} ${css.dotActive}`;
                } else if (distance === 1) {
                  dotClass = `${css.dot} ${css.dotNear}`;
                } else if (distance === 2) {
                  dotClass = `${css.dot} ${css.dotFar}`;
                }

                return (
                  <button
                    key={positionIndex}
                    type="button"
                    className={dotClass}
                    onClick={() => handleBulletClick(positionIndex)}
                    aria-label={`Перейти до позиції ${positionIndex + 1}`}
                  />
                );
              })}
            </div>
          )}

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
              <use href="/sprite.svg/#arrow_back"></use>
            </svg>
          </button>

          <button
            type="button"
            className={`${css.navBtn} ${css.navNext} ${
              isNextDisabled ? css.navBtnDisabled : ""
            }`}
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="Наступні товари"
          >
            <svg className={css.icon} width={24} height={24}>
              <use href="/sprite.svg/#arrow_forward"></use>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
