"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { type Good } from "@/types/goods";
import styles from "./GoodForPurchase.module.css";
import { useBasket } from "@/stores/basketStore";
import toast from "react-hot-toast";

interface GoodForPurchaseProps {
  good: Good;
}

export default function GoodForPurchase({ good }: GoodForPurchaseProps) {
  const { addGood } = useBasket();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Логіка ініціалізації зображень
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    if (good.image) {
      let imgList: string[] = [];
      if (Array.isArray(good.image)) {
        imgList = good.image.map((img: any) =>
          typeof img === "object" && img.url ? img.url : img
        );
      } else if (typeof good.image === "string") {
        imgList = [good.image];
      }
      setImages(imgList);
      if (imgList.length > 0) {
        setMainImage(imgList[0]);
      }
    }
  }, [good.image]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleValidation = () => {
    if (good.size && good.size?.length > 0 && !selectedSize) {
      setErrorMsg("Будь ласка, оберіть розмір");
      return false;
    }
    if (good.color && good.color?.length > 0 && !selectedColor) {
      setErrorMsg("Будь ласка, оберіть колір");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const prepareForCheckout = () => {
    // Функція додавання товару у кошик перед переходом на чекаут
    addGood({
      id: good._id,
      name: good.name,
      price: good.price,
      quantity: quantity,
      image: mainImage,
      size: selectedSize || "",
      color: selectedColor || undefined,
    });
    setQuantity(1);
  };

  // --- ЛОГІКА КНОПОК ---
  const handleAddToCart = () => {
    if (!handleValidation()) return;

    prepareForCheckout();
    toast.success(`${quantity} шт. ${good.name} додано в кошик!`);
  };

  const handleBuyNow = () => {
    if (!handleValidation()) return;

    prepareForCheckout();
    toast("Товар додано. Перенаправляємо на оформлення замовлення!", {
      icon: "🛒",
    });
  };

  const renderStars = (rating: number) => {
    const MAX_STARS = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    const starProps = { width: 20, height: 20 };

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Image
          key={`full-${i}`}
          src="/svg/star_filled.svg"
          alt="full star"
          {...starProps}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Image
          key="half"
          src="/svg/star_half.svg"
          alt="half star"
          {...starProps}
        />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Image
          key={`empty-${i}`}
          src="/svg/star.svg"
          alt="empty star"
          {...starProps}
        />
      );
    }

    return stars;
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* --- ЛІВА КОЛОНКА: ГАЛЕРЕЯ */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            {mainImage && (
              <Image
                src={mainImage}
                alt={good.name}
                fill
                className={styles.mainImage}
                priority
                sizes="(min-width:1440px) 40vw, (min-width:768px) 50vw, 100vw"
              />
            )}
            {!mainImage && (
                <div style={{ padding: '50%', textAlign: 'center', color: 'var(--color-neutral)' }}>
                    Немає фото
                </div>
            )}
          </div>
          {images.length > 1 && (
            <ul className={styles.thumbnails}>
              {images.map((imgUrl, idx) => (
                <li
                  key={idx}
                  className={`${styles.thumbnailItem} ${
                    mainImage === imgUrl ? styles.activeThumb : ""
                  }`}
                  onClick={() => setMainImage(imgUrl)}
                >
                  <Image
                    src={imgUrl}
                    alt={`preview ${idx}`}
                    width={80}
                    height={100}
                    className={styles.thumbImage}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- ПРАВА КОЛОНКА: ІНФОРМАЦІЯ --- */}
        <div className={styles.info}>
          <p className={styles.categoryPath}>
            Всі товари — {good.category?.name || "Каталог"} — {good.name}
          </p>

          <h1 className={styles.title}>{good.name}</h1>

          <div className={styles.meta}>
            <span className={styles.price}>
              {good.price} {good.currency || "₴"}
            </span>
            <div className={styles.rating}>
              {renderStars(good.averageRating || 0)}
              <span>{good.averageRating || 0}</span>
              <span className={styles.reviewsCount}>
                ({good.feedbackCount || 0} відгуків)
              </span>
            </div>
          </div>
          <p className={styles.detailContent}>
            Безкоштовна доставка від 1000 грн.
          </p>

          {good.prevDescription && (
            <p className={styles.shortDescription}>{good.prevDescription}</p>
          )}

          {good.color && good.color.length > 0 && (
            <div className={styles.selectorBlock}>
              <p className={styles.selectorTitle}>Колір</p>
              <select
                className={`${styles.selectDropdown} ${styles.colorDropdown}`}
                value={selectedColor || ""}
                onChange={(e) => {
                  setSelectedColor(e.target.value);
                  setErrorMsg(null);
                }}
              >
                <option value="" disabled>
                  Оберіть колір
                </option>
                {good.color.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <p className={styles.selectedValueDisplay}>
                Обрано: {selectedColor || "—"}
              </p>
            </div>
          )}

          {good.size && good.size.length > 0 && (
            <div className={styles.selectorBlock}>
              <p className={styles.selectorTitle}>Розмір</p>
              <select
                className={`${styles.selectDropdown} ${styles.sizeDropdown}`}
                value={selectedSize || ""}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                  setErrorMsg(null);
                }}
              >
                <option value="" disabled>
                  Оберіть розмір
                </option>
                {good.size.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <p className={styles.selectedValueDisplay}>
                Обрано: {selectedSize || "—"}
              </p>
            </div>
          )}

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <div className={styles.purchaseActions}>
            <div className={styles.quantitySelector}>
              <button
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>

            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Додати в кошик
            </button>

            <button className={styles.buyNowBtn} onClick={handleBuyNow}>
              Купити зараз
            </button>
          </div>

          <div className={styles.details}>
            <div className={styles.detailSummary}>Опис</div>
            <div className={styles.detailContent}>
              {good.characteristics && good.characteristics.length > 0 ? (
                <ul className={styles.characteristicsList}>
                  {good.characteristics.map((char, index) => (
                    <li key={index}>{char}</li>
                  ))}
                </ul>
              ) : (
                <p>Детальні характеристики відсутні.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
