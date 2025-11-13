"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import GoodForPurchase from "@/components/GoodForPurchase/GoodForPurchase";
import GoodReviews from "@/components/GoodReviews/GoodReviews";
import Loader from "@/app/loading";
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo";

import { Good } from "@/types/goods";
import { getGoodByIdClient } from "@/lib/productsServise";

import ReviewModal from "@/components/ReviewModal/ReviewModal";
import { useBasket } from "@/stores/basketStore";
import BasketModalPage from "@/app/(private routes)/basket/page";

import styles from "./GoodPage.module.css";

interface GoodPageClientProps {
  goodId: string;
  reviewsPerPage: number;
}

export default function GoodPageClient({
  goodId,
  reviewsPerPage,
}: GoodPageClientProps) {
  const [openReview, setOpenReview] = useState(false);
  const [openBasket, setOpenBasket] = useState(false);

  const { goods, addGood } = useBasket();

  const {
    data: good,
    isLoading,
    isError,
  } = useQuery<Good>({
    queryKey: ["good", goodId],
    queryFn: () => getGoodByIdClient(goodId),
    staleTime: 1000 * 60 * 5,
    enabled: !!goodId,
  });

  const handleBasketClick = () => {
    setOpenBasket(true);
    console.log("basket", goods);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !good) {
    return (
      <div className={styles.centerContainer}>
        <MessageNoInfo
          text="На жаль, товар не знайдено, або виникла помилка завантаження."
          buttonText="До покупок"
          route="/goods"
        />
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <GoodForPurchase good={good} />

        {/* 🔽 ТВОЇ ТРИ КНОПКИ */}
        <div className={styles.actions}>
          <button
            onClick={() => setOpenReview(true)}
            style={{ padding: "14px 20px", borderRadius: 12, fontWeight: 600 }}
          >
            Залишити відгук
          </button>

          <button
            onClick={() => addGood({ id: good._id, quantity: 1 })}
            style={{ padding: "14px 20px", borderRadius: 12, fontWeight: 600 }}
          >
            додати товар
          </button>

          <button
            onClick={handleBasketClick}
            style={{ padding: "14px 20px", borderRadius: 12, fontWeight: 600 }}
          >
            Кошик (інфа в консолі)
          </button>
        </div>

        {openBasket && <BasketModalPage />}

        <GoodReviews goodId={goodId} reviewsPerPage={reviewsPerPage} />

        {/* Модалка відгуку */}
        <ReviewModal
          open={openReview}
          onClose={() => setOpenReview(false)}
          productId={goodId}
          category={good.category}
        />
      </div>
    </main>
  );
}
