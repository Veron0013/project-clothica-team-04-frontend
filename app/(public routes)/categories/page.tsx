import { getCategories } from "@/lib/api/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CategoriesPage from "./page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сторінка категорій товарів",
  description:
    "Clothica — це місце, де комфорт поєднується зі стилем. На сторінці категорій, дуже зручно, почати шукати потрібний одяг.",
  openGraph: {
    title: " 👕 Сторінка категорій товарів",
    description: "Clothica — це місце, де комфорт поєднується зі стилем.",
    url: "https://clothica-team-04-frontend.vercel.app/categories",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dyounr2tf/image/upload/v1762702727/jackets_xsivjo.png", // Ваше зображення
        width: 800,
        height: 600,
        alt: "Зображення категорії",
      },
    ],
  },
};

export default async function Page() {
  const queryClient = new QueryClient();
  const initialPage = 1;
  await queryClient.prefetchQuery({
    queryKey: ["categories", initialPage],
    queryFn: () => getCategories(initialPage),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesPage initialPage={initialPage} />
    </HydrationBoundary>
  );
}
