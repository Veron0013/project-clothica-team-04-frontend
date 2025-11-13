"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/api";
import { CategoriesList } from "@/components/CategoriesList/CategoriesList";
import css from "./pageClient.module.css";

type Props = {
  initialPage: number; // 1
  limit: number; // 3 або 6
};

export default function CategoriesPage({ initialPage, limit }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["categories", limit],
      queryFn: ({ pageParam = initialPage }) =>
        getCategories(pageParam as number, limit),
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      initialPageParam: initialPage,
      staleTime: 1000 * 60,
    });

  const allCategories = data?.pages.flatMap((page) => page.categories) ?? [];

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const isInitialLoading = status === "pending" && allCategories.length === 0;

  return (
    <section className={css.pageContainer}>
      <h1 className={css.pageTitle}>Категорії</h1>

      {isInitialLoading && (
        <p className={css.loadingText}>Завантаження початкових даних...</p>
      )}

      {allCategories.length > 0 && (
        <CategoriesList categories={allCategories} />
      )}

      {hasNextPage && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isFetchingNextPage}
          className={css.loadMoreButton}
        >
          {isFetchingNextPage ? "Завантаження..." : "Показати більше"}
        </button>
      )}
    </section>
  );
}
