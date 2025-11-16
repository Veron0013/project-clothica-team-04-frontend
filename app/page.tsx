import Hero from "@/components/Hero/Hero";
import Style from "@/components/Style/Style";
import PopularCategories from "@/components/PopularCategories/PopularCategories";
import PopularGoods from "@/components/PopularGoods/PopularGoods";
import LastReviews from "@/components/LastReviews/LastReviews";
import {
  fetchPopularGoods,
  fetchPopularCategories,
} from "@/lib/api/mainPageApi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clothica — стильний одяг | Головна",
  description:
    "Clothica — онлайн-магазин базового одягу: універсальні моделі, які легко поєднуються, високоякісні тканини та сучасний дизайн. Оберіть свою базу на кожен день вже сьогодні.",
  keywords: [
    "Clothica",
    "базовий одяг",
    "універсальний стиль",
    "онлайн-магазин одягу Україна",
    "якісний базовий одяг",
    "одяг кожен день",
  ],
  openGraph: {
    title: "Clothica — стильний одяг | Головна",
    description:
      "Clothica — онлайн-магазин базового одягу: універсальні моделі, які легко поєднуються, високоякісні тканини та сучасний дизайн. Оберіть свою базу на кожен день вже сьогодні.",
    url: "https://clothica-team-04-frontend.vercel.app/",
    images: [
      {
        url: "https://res.cloudinary.com/dgqxe7g3j/image/upload/v1763214919/Clothica_c9xfco.webp",
        width: 1200,
        height: 630,
        alt: "Clothica — базовий стиль одягу",
      },
    ],
    type: "website",
  },
};

export default async function Home() {
  const [catsRes, goodsRes] = await Promise.allSettled([
    fetchPopularCategories({ page: 1, limit: 4 }),
    fetchPopularGoods({ page: 1, limit: 6 }),
  ]);

  const initialCategories =
    catsRes.status === "fulfilled"
      ? catsRes.value
      : {
          categories: [],
          page: 1,
          perPage: 4,
          totalCategories: 0,
          totalPages: 1,
        };

  const initialPopularGoods =
    goodsRes.status === "fulfilled"
      ? goodsRes.value
      : { items: [], page: 1, limit: 6, total: 0, totalPages: 1 };

  return (
    <>
      <Hero />
      <Style />
      <PopularCategories initialData={initialCategories} />
      <PopularGoods initialData={initialPopularGoods} />
      <LastReviews />
    </>
  );
}
