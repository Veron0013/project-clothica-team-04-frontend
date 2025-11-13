"use client";
import css from "./PopularGoods.module.css";
import Link from "next/link";
import { useRef, useState, useMemo } from "react";
import { type Good } from "@/types/goods";
import HomeGoodInfo from "../HomeGoodInfo/HomeGoodInfo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Navigation, Keyboard, Pagination } from "swiper/modules";
import { fetchPopularGoods } from "@/lib/api/mainPageApi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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

export default function PopularGoods({ initialData }: PopularGoodsProps) {
  const limit = initialData.limit ?? 4;

  const total =
    typeof initialData.total === "number"
      ? initialData.total
      : (initialData.totalPages - 1) * limit + initialData.items.length;

  const seed = {
    ...initialData,
    limit,
    total,
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
            modules={[Navigation, Keyboard, Pagination]}
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
              1440: { slidesPerView: 4 },
            }}
            pagination={{
              clickable: true,
              el: ".popularPagination",
            }}
            className={css.swiper}
          >
            {goods.map((good) => (
              <SwiperSlide tag="ul" key={good._id}>
                <HomeGoodInfo item={good} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={`popularPagination ${css.pagination}`}></div>
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
            disabled={isNextDisabled || isFetchingNextPage}
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
