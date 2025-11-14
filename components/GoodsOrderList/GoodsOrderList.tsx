"use client";

import { useEffect, useState, useMemo } from "react";
import { useBasket } from "@/stores/basketStore";
import { BasketStoreGood } from "@/types/goods";
import Image from "next/image";
import { getGoodsFromArray } from "@/lib/api/api";
import css from "./GoodsOrderList.module.css";

export default function GoodsOrderList() {
  const { goods: basketGoods, updateGoodQuantity, removeGood } = useBasket();
  const [goodsData, setGoodsData] = useState<BasketStoreGood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoods() {
      if (basketGoods.length === 0) {
        setGoodsData([]);
        return;
      }

      try {
        setLoading(true);
        // робимо запит на бек, передаємо масив id
        const data = await getGoodsFromArray({
          goodIds: basketGoods.map((g) => g.id),
        });

        // Мерджимо quantity зі стору
        const merged = data.map((item) => {
          const found = basketGoods.find((g) => g.id === item._id);
          return {
            ...item,
            quantity: found?.quantity || 1,
          };
        });

        setGoodsData(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGoods();
  }, [basketGoods]);

  //  Обчислення проміжного підсумку та загальної суми
  const subtotal = useMemo(() => {
    return goodsData.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }, [goodsData]);

  const deliveryCost = subtotal > 0 ? 99 : 0; // умовна доставка
  const total = subtotal + deliveryCost;

  if (loading) return <div className={css.basketLoading}>Loading...</div>;
  if (goodsData.length === 0)
    return <div className={css.basketEmpty}>Кошик порожній</div>;
  return (
    <div className={css.basketContainer}>
      {goodsData.map((item) => (
        <div key={item._id} className={css.basketItem}>
          <Image
            src={item.image}
            alt={item.name}
            width={82}
            height={100}
            className={css.basketItemImage}
          />
          <div className={css.basketCard}>
            <div className={css.basketItemInfo}>
              <div className={css.basketItemHead}>
                <div className={css.basketItemName}>{item.name}</div>
                {item.feedbackCount !== undefined && (
                  <div className={css.basketItemFeedback}>
                    {item.averageRating ? `⭐ ${item.averageRating} / ` : ""}
                    {item.feedbackCount} відгуків
                  </div>
                )}
              </div>
              <div className={css.basketItemPrice}>
                {item.price} {item.currency}
              </div>
            </div>
            <div className={css.basketInputBtn}>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateGoodQuantity(item._id, Number(e.target.value))
                }
                className={css.basketItemQuantity}
              />

              <button
                onClick={() => removeGood(item._id)}
                className={css.basketItemRemove}
              >
                <svg width="24" height="24">
                  <use href="/sprite.svg#delete" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className={css.basketSummaryItem}>
        <div className={css.basketSummaryRow}>
          <div className={css.basketSumTitle}>Проміжний підсумок:</div>
          <div className={css.basketSumCost}>{subtotal.toFixed(2)} грн</div>
        </div>
        <div className={css.basketDelivery}>
          <div className={css.basketSumTitle}>Доставка:</div>
          <div className={css.basketSumCost}>{deliveryCost.toFixed(2)} грн</div>
        </div>
        <div className={css.basketSummaryTotal}>
          <div className={css.basketTotalTitle}>Всього:</div>
          <div className={css.basketTotalPrice}>{total.toFixed(2)} грн</div>
        </div>
      </div>
    </div>
  );
}
