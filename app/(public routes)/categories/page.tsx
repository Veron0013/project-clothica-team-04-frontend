import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getCategories } from "@/lib/api/api";
import CategoriesPageClient from "./page-client";

const INITIAL_LIMIT = 6;
const LOAD_MORE_STEP = 3;

export default async function CategoriesPage() {
  const queryClient = new QueryClient();
  const initialPage = 1;

  // Prefetch перших 6 елементів (page 1, perPage 6)
  await queryClient.prefetchQuery({
    queryKey: ["categories", INITIAL_LIMIT],
    queryFn: () => getCategories(initialPage, INITIAL_LIMIT),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesPageClient
        initialLimit={INITIAL_LIMIT}
        loadMoreStep={LOAD_MORE_STEP}
      />
    </HydrationBoundary>
  );
}
