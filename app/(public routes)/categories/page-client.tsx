"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/api";
import { CategoriesList } from "@/components/CategoriesList/CategoriesList";

import css from "./pageClient.module.css";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";

type Props = {
  initialPage: number;
};

export default function CategoriesPage({ initialPage }: Props) {
  const limit = useIsDesktop();
  const isLimitDefined = limit > 0;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["categories", limit],
      queryFn: ({ pageParam = initialPage }) =>
        getCategories(pageParam as number, limit),
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      initialPageParam: initialPage,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60,
      enabled: isLimitDefined,
    });

  const allCategories = data?.pages.flatMap((page) => page.categories) ?? [];

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const isInitialLoading =
    (status === "pending" && allCategories.length === 0) || !isLimitDefined;

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
