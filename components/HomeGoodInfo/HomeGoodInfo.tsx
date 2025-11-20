import css from './HomeGoodInfo.module.css';
import { type Good } from '@/types/goods';
import Link from 'next/link';
import Image from 'next/image';

interface HomeGoodInfoProp {
  item: Good;
  isDragging: boolean;
}

export default function HomeGoodInfo({ item, isDragging }: HomeGoodInfoProp) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isTouchDevice =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice && isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <li id={item._id.toString()}>
      <article className={css.card} role="article" aria-label={item.name}>
        <Link href={`/goods/${item._id}`} onClick={handleClick}>
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

          <div className={css.cardBody}>
            <div className={css.cardHeader}>
              <h3 className={css.cardTitle}>{item.name}</h3>

              <p className={css.cardPrice}>
                {item.price} {item.currency}
              </p>
            </div>

            <div className={css.metaRow} aria-label="рейтинг та відгуки">
              <div className={css.metaRowInner}>
                <svg width="13" height="12">
                  <use href="/sprite.svg#star-filled" />
                </svg>
                <span className={css.metaStat}>{item.averageRating ?? 0}</span>
              </div>
              <div className={css.metaRowInner}>
                <svg width="14" height="13">
                  <use href="/sprite.svg#feedbacks" />
                </svg>
                <span className={css.metaStat}>{item.feedbackCount ?? 2}</span>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href={`/goods/${item._id}`}
          className={css.cardCta}
          onClick={handleClick}
        >
          Детальніше
        </Link>
      </article>
    </li>
  );
}
