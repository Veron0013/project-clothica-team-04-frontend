import { getCategories } from "@/lib/api/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CategoriesPage from "./page-client";
import { headers } from "next/headers";

export default async function Page() {
  const queryClient = new QueryClient();

  const initialPage = 1;

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  const isMobileOrTablet = /Mobi|Android|iPhone|iPad/i.test(userAgent);

  const limit = isMobileOrTablet ? 4 : 6;

  await queryClient.prefetchQuery({
    queryKey: ["categories", initialPage, limit],
    queryFn: () => getCategories(initialPage, limit),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesPage initialPage={initialPage} limit={limit} />
    </HydrationBoundary>
  );
}
