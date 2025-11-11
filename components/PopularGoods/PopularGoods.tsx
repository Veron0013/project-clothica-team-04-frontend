"use client";
import css from "./PopularGoods.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { type Good } from "@/types/goods";
import { GoodsList } from "../GoodsList";

// type PopularGoodsProps = {
//   initialData: {
//     items: Good[];
//     page: number;
//     totalPage: number;
//   };
// };

export default function PopularGoods() {
  return (
    <section className={css.container}>
      <div className={css.container}>
        <h2 className={css.title}></h2>
      </div>
    </section>
  );
}
