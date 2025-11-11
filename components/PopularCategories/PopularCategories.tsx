"use client";

import css from "./PopularCategories.module.css";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Keyboard, A11y } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";

export default function PopularCategories() {
  return (
    <section id="popular-categories" className={css.categories}>
      <div className={css.container}>
        <h2 className={css.title}>Популярні категорії</h2>
        <button>Всі категорії</button>
      </div>
    </section>
  );
}
