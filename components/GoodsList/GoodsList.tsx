'use client';

import React, { useState } from 'react';
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
import { animateToCart } from '@/lib/animateToCart';

type Props = {
  items: Good[];
  dataQty: number;
};

// 🔹 утиліта, яка безпечно дістає src картинки з товару
const getImageSrc = (image: Good['image']): string => {
  const value: any = image;

  if (!value) return '';

  if (typeof value === 'string') return value;

  if (Array.isArray(value) && value.length > 0) {
    const first = value[0] as any;
    if (typeof first === 'string') return first;
    if (first && typeof first.url === 'string') return first.url;
  }

  return '';
};

export function GoodsList({ items, dataQty }: Props) {
  const isClient = useIsClient();
  const isDesktopLayout = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop})`);

  const [addedGoods, setAddedGoods] = useState<Record<string, boolean>>({});

  const handleAddToBasket = (
    item: Good,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // 1. додаємо в кошик
    useBasket.getState().addGood({
      id: item._id,
      price: item.price,
    });

    setAddedGoods(prev => ({
      ...prev,
      [item._id]: true,
    }));

    toastMessage(MyToastType.success, `Товар «${item.name}» додано до кошика`);

    // 2. знаходимо кнопку кошика в Header
    const cartIconEl = document.querySelector(
      '[data-cart-button="header-cart"]'
    ) as HTMLElement | null;

    if (!cartIconEl) {
      console.log('❌ Не знайшли кнопку кошика в Header');
      return;
    }

    const button = event.currentTarget;
    const card = button.closest(
      '[data-card="good-card"]'
    ) as HTMLElement | null;

    if (!card) {
      console.log('❌ Не знайшли card для анімації');
      return;
    }

    const imgWrap = card.querySelector(
      '[data-card-img-wrap="true"]'
    ) as HTMLElement | null;

    const sourceRect = imgWrap
      ? imgWrap.getBoundingClientRect()
      : button.getBoundingClientRect();

    const cartRect = cartIconEl.getBoundingClientRect();

    // 🔹 тут вже безпечне діставання src
    const imageSrc = getImageSrc(item.image);

    if (!imageSrc) {
      console.log('❌ imageSrc порожній, анімація не запущена');
      return;
    }

    animateToCart({
      imageRect: sourceRect,
      cartRect,
      imageSrc,
    });
  };

  if (!isClient) return null;

  return (
    <ul className={css.list}>
      <AnimatePresence>
        {items.map((item: Good, index: number) => {
          const isNew = index >= items.length - dataQty;
          const delay = isNew ? (index - (items.length - dataQty)) * 100 : 0;

          const isAdded = !!addedGoods[item._id];
          const cardImageSrc = getImageSrc(item.image) || (item.image as any); // fallback

          return (
            <li
              key={item._id}
              id={item._id.toString()}
              style={{ animationDelay: `${delay}ms` }}
            >
              {isDesktopLayout ? (
                // 🔹 ДЕСКТОП
                <article
                  className={`${css.card} ${css.cardDesktop}`}
                  role="article"
                  aria-label={item.name}
                  data-card="good-card"
                >
                  <Link
                    href={`/goods/${item._id}`}
                    className={css.cardImgLink}
                    aria-label={item.name}
                  >
                    <div className={css.cardImgWrap} data-card-img-wrap="true">
                      <Image
                        src={cardImageSrc as any}
                        alt={item.name}
                        fill
                        sizes="33vw"
                        className={css.cardImg}
                        loading="lazy"
                      />
                    </div>
                  </Link>

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

                      <button
                        type="button"
                        className={`${css.addToCartBtn} ${
                          isAdded ? css.addToCartBtn_active : ''
                        }`}
                        onClick={e => handleAddToBasket(item, e)}
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
                  data-card="good-card"
                >
                  <Link
                    href={`/goods/${item._id}`}
                    className={css.cardImgLink}
                    aria-label={item.name}
                  >
                    <div className={css.cardImgWrap} data-card-img-wrap="true">
                      <Image
                        src={cardImageSrc as any}
                        alt={item.name}
                        fill
                        sizes="(min-width:1440px) 25vw, (min-width:768px) 25vw, 50vw"
                        className={css.cardImg}
                        loading="lazy"
                      />
                    </div>
                  </Link>

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
                        onClick={e => handleAddToBasket(item, e)}
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
