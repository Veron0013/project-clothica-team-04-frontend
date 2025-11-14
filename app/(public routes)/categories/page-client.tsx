// ////////////////////////////////////////////////////
// "use client";

// import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
// import { getCategories } from "@/lib/api/api";
// import { CategoriesList } from "@/components/CategoriesList/CategoriesList";

// import css from "./pageClient.module.css";

// type Props = {
//   initialPage: number; // 1
//   limit: number; // 3 або 6
// };

// export default function CategoriesPage({ initialPage, limit }: Props) {
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
//     useInfiniteQuery({
//       queryKey: ["categories", limit],
//       queryFn: ({ pageParam = initialPage }) =>
//         getCategories(pageParam as number, limit),
//       getNextPageParam: (lastPage) => {
//         if (lastPage.page < lastPage.totalPages) {
//           return lastPage.page + 1;
//         }
//         return undefined;
//       },
//       initialPageParam: initialPage,
//       placeholderData: keepPreviousData,

//       staleTime: 1000 * 60,
//     });

//   const allCategories = data?.pages.flatMap((page) => page.categories) ?? [];

//   const handleLoadMore = () => {
//     fetchNextPage();
//   };

//   const isInitialLoading = status === "pending" && allCategories.length === 0;

//   return (
//     <section className={css.pageContainer}>
//       <h1 className={css.pageTitle}>Категорії</h1>

//       {isInitialLoading && (
//         <p className={css.loadingText}>Завантаження початкових даних...</p>
//       )}

//       {allCategories.length > 0 && (
//         <CategoriesList categories={allCategories} />
//       )}

//       {hasNextPage && (
//         <button
//           type="button"
//           onClick={handleLoadMore}
//           disabled={isFetchingNextPage}
//           className={css.loadMoreButton}
//         >
//           {isFetchingNextPage ? "Завантаження..." : "Показати більше"}
//         </button>
//       )}
//     </section>
//   );
// }
/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

// "use client";

// import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
// import { getCategories } from "@/lib/api/api";
// import { CategoriesList } from "@/components/CategoriesList/CategoriesList";
// import { useMediaQuery } from "react-responsive";
// import { useState, useMemo } from "react";

// import css from "./pageClient.module.css";

// type Props = {
//   initialPage: number;
//   limit: number;
// };

// export default function CategoriesPage({ initialPage, limit }: Props) {
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
//     useInfiniteQuery({
//       queryKey: ["categories", limit],
//       queryFn: ({ pageParam = initialPage }) =>
//         getCategories(pageParam as number, limit),
//       getNextPageParam: (lastPage) => {
//         if (lastPage.page < lastPage.totalPages) {
//           return lastPage.page + 1;
//         }
//         return undefined;
//       },
//       initialPageParam: initialPage,
//       placeholderData: keepPreviousData,
//       staleTime: 1000 * 60,
//     });

//   const allCategories = data?.pages.flatMap((page) => page.categories) ?? [];

//   // --- Breakpoints (react-responsive)
//   const isDesktop = useMediaQuery({ minWidth: 1440 });
//   // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1439 }); // можна використовувати при потребі

//   // --- Базова кількість карток за брейкпоінтом (не в стейті)
//   const baseCount = isDesktop ? 6 : 4;

//   // --- Додаткові показані картки через кнопку "Показати більше"
//   const [extraCount, setExtraCount] = useState(0);

//   // visibleCount — похідне значення
//   const visibleCount = useMemo(
//     () => baseCount + extraCount,
//     [baseCount, extraCount]
//   );

//   // visibleCategories — беремо тільки потрібну кількість з allCategories
//   const visibleCategories = allCategories.slice(0, visibleCount);

//   const handleLoadMore = () => {
//     // Якщо вже показали всі завантажені — підвантажуємо наступну сторінку
//     if (visibleCount >= allCategories.length && hasNextPage) {
//       fetchNextPage();
//     }
//     // Незалежно від цього — збільшуємо кількість видимих карток
//     setExtraCount((prev) => prev + 3);
//   };

//   const isInitialLoading = status === "pending" && allCategories.length === 0;

//   return (
//     <section className={css.pageContainer}>
//       <h1 className={css.pageTitle}>Категорії</h1>

//       {isInitialLoading && (
//         <p className={css.loadingText}>Завантаження початкових даних...</p>
//       )}

//       {visibleCategories.length > 0 && (
//         <CategoriesList categories={visibleCategories} />
//       )}

//       {(hasNextPage || visibleCount < allCategories.length) && (
//         <button
//           type="button"
//           onClick={handleLoadMore}
//           disabled={isFetchingNextPage}
//           className={css.loadMoreButton}
//         >
//           {isFetchingNextPage ? "Завантаження..." : "Показати більше"}
//         </button>
//       )}
//     </section>
//   );
// }

/////////////////////////////////////////////////
// працює непогано але нестабільно!!!
/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////
// тут створюю хук
"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/api";
import { CategoriesList } from "@/components/CategoriesList/CategoriesList";

import css from "./pageClient.module.css";
import { useIsDesktop } from "@/lib/hooks/useIsDesktop";

type Props = {
  initialPage: number; // 1
  // limit: number; // 3 або 6
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
