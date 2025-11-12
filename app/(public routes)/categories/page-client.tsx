"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/api";
import { CategoriesList } from "@/components/CategoriesList/CategoriesList";

type Props = {
  initialLimit: number; // 6
  loadMoreStep: number; // 3
};

export default function CategoriesPageClient({
  initialLimit,
  loadMoreStep,
}: Props) {
  const [perPage, setPerPage] = useState(initialLimit);
  const page = 1;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categories", perPage],
    queryFn: () => getCategories(page, perPage),
  });

  const categories = data?.categories ?? [];
  const total = data?.totalCategories ?? 0;

  const hasMore = categories.length < total;

  const handleLoadMore = () => {
    if (hasMore) {
      setPerPage((prev) => prev + loadMoreStep);
    }
  };

  const isInitialLoading = isLoading && perPage === initialLimit;

  return (
    <section style={{ padding: "20px" }}>
      <h1>Категорії</h1>

      {isInitialLoading && <p>Завантаження...</p>}

      {(!isInitialLoading || categories.length > 0) && (
        <CategoriesList categories={categories} />
      )}

      {hasMore && (
        <button onClick={handleLoadMore} disabled={isFetching}>
          {isFetching ? "Завантаження..." : "Показати більше"}
        </button>
      )}
    </section>
  );
}
