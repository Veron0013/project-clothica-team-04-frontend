// app/categories/page.tsx
import { getCategories } from "@/lib/api/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CategoriesPage from "./page-client";

export default async function Page() {
  const queryClient = new QueryClient();

  const initialPage = 1;
  const perPage = 6;

  await queryClient.prefetchQuery({
    queryKey: ["categories", initialPage, perPage],
    queryFn: () => getCategories(initialPage, perPage),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesPage initialPage={initialPage} perPage={perPage} />
    </HydrationBoundary>
  );
}
