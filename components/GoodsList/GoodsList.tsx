"use client";

import css from "./GoodsList.module.css";
import Image from "next/image";
import Link from "next/link";
import { Good } from "@/types/goods";
import { AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { BREAKPOINTS } from "@/lib/vars";

type Props = {
  items: Good[];
};

export function GoodsList({ items }: Props) {
  const isClient = useIsClient();
  const isDesktopLayout = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop})`);

  if (!isClient) return null;

  return (
    <ul className={css.list}>
      <AnimatePresence>
        {items.map((item: Good, index: number) => (
          <li
            key={item._id}
            id={item._id.toString()}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {isDesktopLayout ? (
              // 🔹 ДЕСКТОПНА РОЗМІТКА
              <article
                className={`${css.card} ${css.cardDesktop}`}
                role="article"
                aria-label={item.name}
              >
                {/* 1. Верхній блок з картинкою (клікабельний) */}
                <Link
                  href={`/goods/${item._id}`}
                  className={css.cardImgLink}
                  aria-label={item.name}
                >
                  <div className={css.cardImgWrap}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="25vw"
                      className={css.cardImg}
                      loading="lazy"
                    />
                  </div>
                </Link>

                {/* 2. Низ картки: текст + ціна + кнопка */}
                <div className={css.cardBottom}>
                  <div className={css.cardBody}>
                    <div className={css.itemPrice}>
                      <h3 className={css.cardTitle}>{item.name}</h3>
                      <div className={css.cardPrice}>
                        {item.price} {item.currency}
                      </div>
                    </div>
                  </div>

                  <div className={css.metaRow} aria-label="рейтинг та відгуки">
                    <div className={css.metaRowInner}>
                      <svg width="13" height="12">
                        <use href="/sprite.svg#star-filled" />
                      </svg>
                      <span className={css.metaStat}>
                        {item.averageRating ?? 0}
                      </span>
                    </div>
                    <div className={css.metaRowInner}>
                      <svg width="14" height="13">
                        <use href="/sprite.svg#feedbacks" />
                      </svg>
                      <span className={css.metaStat}>
                        {item.feedbackCount ?? 2}
                      </span>
                    </div>
                  </div>

                  <Link href={`/goods/${item._id}`} className={css.cardCta}>
                    Детальніше
                  </Link>
                </div>
              </article>
            ) : (
              // 🔹 МОБІЛКА / ТАБЛЕТ
              <article
                className={css.card}
                role="article"
                aria-label={item.name}
              >
                {/* 1. Верхній блок з картинкою (клікабельний) */}
                <Link
                  href={`/goods/${item._id}`}
                  className={css.cardImgLink}
                  aria-label={item.name}
                >
                  <div className={css.cardImgWrap}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width:1440px) 25vw, (min-width:768px) 25vw, 50vw"
                      className={css.cardImg}
                      loading="lazy"
                    />
                  </div>
                </Link>

                {/* 2. Низ картки: текст + ціна */}
                <div className={css.cardBody}>
                  <h3 className={css.cardTitle}>{item.name}</h3>

                  <div className={css.metaRow} aria-label="рейтинг та відгуки">
                    <div className={css.metaRowInner}>
                      <svg width="13" height="12">
                        <use href="/sprite.svg#star-filled" />
                      </svg>
                      <span className={css.metaStat}>
                        {item.averageRating ?? 0}
                      </span>
                    </div>
                    <div className={css.metaRowInner}>
                      <svg width="14" height="13">
                        <use href="/sprite.svg#feedbacks" />
                      </svg>
                      <span className={css.metaStat}>
                        {item.feedbackCount ?? 2}
                      </span>
                    </div>
                  </div>

                  <div className={css.cardPrice}>
                    {item.price} {item.currency}
                  </div>
                </div>

                {/* 3. Кнопка внизу */}
                <Link href={`/goods/${item._id}`} className={css.cardCta}>
                  Детальніше
                </Link>
              </article>
            )}
          </li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
