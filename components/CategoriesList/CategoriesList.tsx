"use client";

import Image from "next/image";
import { Category } from "@/types/categories";

type Props = {
  categories: Category[];
};

export const CategoriesList = ({ categories }: Props) => {
  return (
    <ul>
      {categories.map((cat) => (
        <li key={cat._id}>
          <Image src={cat.image} alt={cat.name} width={150} height={150} />
          <p>{cat.name}</p>
        </li>
      ))}
    </ul>
  );
};
