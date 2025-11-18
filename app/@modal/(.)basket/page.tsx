"use client";

import { useRouter } from "next/navigation";
import { useBasket } from "@/stores/basketStore";
import Modal from "@/components/Modal/Modal";
import style from "./ModalBasket.module.css";
import GoodsOrderList from "@/components/GoodsOrderList/GoodsOrderList";
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo";

export default function BasketModalPage() {
  const router = useRouter();
  const goods = useBasket((state) => state.goods);

  const closeModal = () => {
    router.back();
  };

  const handlePush = (path: string) => {
    router.back();
    setTimeout(() => {
      router.push(path);
    }, 50);
  };
  return (
    <Modal open={true} onClose={closeModal}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => {
            closeModal();
          }}
          className={style.closeBtn}
        >
          <svg width="24" height="24">
            <use href="/sprite.svg#close" />
          </svg>
        </button>

        <div className={style.title}>Ваш кошик</div>

        {goods.length > 0 ? (
          <>
            <GoodsOrderList />

            <div className={style.btnForm}>
              <button
                onClick={() => handlePush("/goods")}
                className={style.btnGoods}
              >
                Продовжити покупки
              </button>
              <button
                onClick={() => handlePush("/order")}
                className={style.btnOrder}
              >
                Оформити замовлення
              </button>
            </div>
          </>
        ) : (
          <div className={style.basketEmpty}>
            <MessageNoInfo
              text="Ваш кошик порожній, мершій до покупок!"
              buttonText="До покупок"
              route="/goods"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
