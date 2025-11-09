"use client";
import React from "react";
import styles from "./GoodsList.module.css";
import Image from "next/image";
import Link from "next/link";

type MinimalCardProps = { item: GoodsListItem };
function MinimalCard({ item }: MinimalCardProps) {
  return (
    <article className={styles.card} role="article" aria-label={item.title}>
      {/* Изображение 3x4 */}
      <div className={styles.cardImgWrap} style={{ position: "relative" }}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width:1440px) 25vw, (min-width:768px) 25vw, 50vw"
          className={styles.cardImg}
          priority={false}
        />
      </div>

      <div className={styles.cardBody}>
        {/* Заголовок + цена */}
        <div className={styles.cardTop}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <span className={styles.cardPrice}>{item.price} грн</span>
        </div>

        {/* Рейтинг и отзывы */}
        <div className={styles.metaRow} aria-label="рейтинг та відгуки">
          <span className={styles.metaStat}>★ {item.rating ?? 5}</span>
          <span className={styles.metaDot} aria-hidden="true">•</span>
          <span className={styles.metaStat}>{item.reviewsCount ?? 2}</span>
        </div>

        {/* CTA */}
        <Link href={`/goods/${item.id}`} className={styles.cardCta}>
          Детальніше
        </Link>
      </div>
    </article>
  );
}

export type GoodsListItem = {
  id: string | number;
  title: string;
  price: number;
  image: string;          // url для картинки
  rating?: number;
  reviewsCount?: number;
  category?: string;
};

type Props = {
  items: GoodsListItem[];        // что рендерим
  total: number;                 // сколько всего на сервере
  isLoading?: boolean;
  isError?: boolean;
  onLoadMore?: () => void;       // серверная пагинация – “+3”
  onResetFilters?: () => void;   // сброс чекбоксов/URL
  // если GoodInfo ожидает другие пропы — можно пробросить кастомный рендер
  renderItem?: (item: GoodsListItem) => React.ReactNode;
};

export function GoodsList({
  items,
  total,
  isLoading = false,
  isError = false,
  onLoadMore,
  onResetFilters,
  renderItem,
}: Props) {
  const hasMore = items.length < total;

  if (isLoading && items.length === 0) {
    return (
      <section>
        <ul className={styles.list} aria-busy>
          {Array.from({ length: 12 }).map((_, i) => (
            <li key={i} className={styles.skelItem} />
          ))}
        </ul>
      </section>
    );
  }

  if (isError) {
    return (
      <EmptyBlock
        text="Сталася помилка завантаження. Спробуйте ще раз."
        onReset={onResetFilters}
      />
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyBlock
        text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх"
        onReset={onResetFilters}
      />
    );
  }

  return (
    <section>
      <ul className={styles.list}>
        {items.map((p) => (
          <li key={p.id} className={styles.item}>
            {renderItem ? renderItem(p) : <MinimalCard item={p} />}
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          className={styles.moreBtn}
          onClick={onLoadMore}
          aria-label="Показати більше товарів"
        >
          Показати більше
        </button>
      )}
    </section>
  );
}

function EmptyBlock({
  text,
  onReset,
}: {
  text: string;
  onReset?: () => void;
}) {
  return (
    <div className={styles.empty}>
      <p>{text}</p>
      {onReset && (
        <button type="button" className={styles.resetBtn} onClick={onReset}>
          Скинути фільтри
        </button>
      )}
    </div>
  );
}