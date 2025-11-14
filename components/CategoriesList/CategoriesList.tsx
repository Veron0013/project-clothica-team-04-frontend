"use client";

import Image from "next/image";
import Link from "next/link";

import { Category } from "@/types/categories";
import css from "./CategoriesList.module.css";

type Props = {
  categories: Category[];
};

export const CategoriesList = ({ categories }: Props) => {
  return (
    <ul className={css.categoriesList}>
      {categories.map((category) => (
        <li key={category._id} className={css.categoryCard}>
          <Link
            href={`/goods?category=${category._id}`}
            className={css.categoryLink}
          >
            <Image
              src={category.image}
              alt={category.name}
              width={250}
              height={250}
              className={css.categoryImage}
            />
            <p className={css.categoryName}>{category.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};
