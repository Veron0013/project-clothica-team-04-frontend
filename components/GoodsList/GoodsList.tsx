'use client';

import { useState } from 'react';
import css from './GoodsList.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Good } from '@/types/goods';
import { AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { useIsClient } from '@/lib/hooks/useIsClient';
import { BREAKPOINTS } from '@/lib/vars';
import { useBasket } from '@/stores/basketStore';
import toastMessage, { MyToastType } from '@/lib/messageService';

type Props = {
  items: Good[];
  dataQty: number;
};

export function GoodsList({ items, dataQty }: Props) {
  const isClient = useIsClient();
  const isDesktopLayout = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop})`);

  // локальний стан: які товари вже "додані" (для зеленої кнопки+галочки)
  const [addedGoods, setAddedGoods] = useState<Record<string, boolean>>({});

  // не підписуємося на стор, а просто викликаємо дію напряму
  const handleAddToBasket = (item: Good) => {
    useBasket.getState().addGood({
      id: item._id,
      price: item.price,
    });

    // позначаємо товар як доданий локально
    setAddedGoods(prev => ({
      ...prev,
      [item._id]: true,
    }));

    // показуємо тост
    toastMessage(MyToastType.success, `Товар «${item.name}» додано до кошика`);
  };

  if (!isClient) return null;

  return (
    <ul className={css.list}>
      <AnimatePresence>
        {items.map((item: Good, index: number) => {
          const isNew = index >= items.length - dataQty;
          const delay = isNew ? (index - (items.length - dataQty)) * 100 : 0;

          const isAdded = !!addedGoods[item._id];

          return (
            <li
              key={item._id}
              id={item._id.toString()}
              style={{ animationDelay: `${delay}ms` }}
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
                        sizes="33vw"
                        className={css.cardImg}
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* 2. Низ картки: текст + ціна + рейтинг + кнопка */}
                  <div className={css.cardBottom}>
                    <div className={css.cardBody}>
                      <div className={css.itemPrice}>
                        <h3 className={css.cardTitle}>{item.name}</h3>
                        <div className={css.cardPrice}>
                          {item.price} {item.currency}
                        </div>
                      </div>
                    </div>

                    <div
                      className={css.metaRow}
                      aria-label="рейтинг та відгуки"
                    >
                      <div className={css.metaRowInner}>
                        <svg width="13" height="12">
                          <use href="/sprite.svg#star-filled" />
                        </svg>
                        <span className={css.metaStat}>
                          {item.averageRating ?? 0}
                        </span>
                      </div>
                      <div className={css.metaRowInner}>
                        <svg className={css.iconFeed} width="14" height="13">
                          <use href="/sprite.svg#feedbacks" />
                        </svg>
                        <span className={css.metaStat}>
                          {item.feedbackCount ?? 2}
                        </span>
                      </div>

                      {/* кнопка корзинки */}
                      <button
                        type="button"
                        className={`${css.addToCartBtn} ${
                          isAdded ? css.addToCartBtn_active : ''
                        }`}
                        onClick={() => handleAddToBasket(item)}
                        aria-label="Додати в кошик"
                      >
                        <svg
                          className={css.addToCartIcon}
                          width="24"
                          height="24"
                          aria-hidden="true"
                        >
                          <use href="/sprite.svg#shopping_cart" />
                        </svg>

                        {isAdded && (
                          <span className={css.addedBadge} aria-hidden="true">
                            <svg width="12" height="12">
                              <use href="/sprite.svg#check" />
                            </svg>
                          </span>
                        )}
                      </button>
                    </div>

                    <div className={css.cardActions}>
                      <Link href={`/goods/${item._id}`} className={css.cardCta}>
                        Детальніше
                      </Link>
                    </div>
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

                  {/* 2. Низ картки: текст + рейтинг + ціна */}
                  <div className={css.cardBody}>
                    <h3 className={css.cardTitle}>{item.name}</h3>

                    <div
                      className={css.metaRow}
                      aria-label="рейтинг та відгуки"
                    >
                      <div className={css.metaRowInner}>
                        <svg width="13" height="12">
                          <use href="/sprite.svg#star-filled" />
                        </svg>
                        <span className={css.metaStat}>
                          {item.averageRating ?? 0}
                        </span>
                      </div>
                      <div className={css.metaRowInner}>
                        <svg className={css.iconFeed} width="14" height="13">
                          <use href="/sprite.svg#feedbacks" />
                        </svg>
                        <span className={css.metaStat}>
                          {item.feedbackCount ?? 2}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`${css.addToCartBtn} ${
                          isAdded ? css.addToCartBtn_active : ''
                        }`}
                        onClick={() => handleAddToBasket(item)}
                        aria-label="Додати в кошик"
                      >
                        <svg
                          className={css.addToCartIcon}
                          width="24"
                          height="24"
                          aria-hidden="true"
                        >
                          <use href="/sprite.svg#shopping_cart" />
                        </svg>

                        {isAdded && (
                          <span className={css.addedBadge} aria-hidden="true">
                            <svg
                              className={css.iconAddedBadge}
                              width="12"
                              height="12"
                            >
                              <use href="/sprite.svg#check" />
                            </svg>
                          </span>
                        )}
                      </button>
                    </div>

                    <div className={css.cardPrice}>
                      {item.price} {item.currency}
                    </div>
                  </div>

                  {/* 3. Кнопка внизу */}
                  <div className={css.cardActions}>
                    <Link href={`/goods/${item._id}`} className={css.cardCta}>
                      Детальніше
                    </Link>
                  </div>
                </article>
              )}
            </li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
