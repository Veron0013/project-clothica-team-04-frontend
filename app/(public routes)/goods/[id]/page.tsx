// app/(public routes)/goods/[id]/page.tsx

import { notFound } from "next/navigation";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import {
  getGoodByIdServer,
  getFeedbackByGoodIdServer,
} from "@/lib/api/productsServer";
import GoodPageClient from "@/components/GoodPage/GoodPage";
import { REVIEWS_PER_LOAD } from "@/lib/vars";

type GoodPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reviewsPage?: string }>;
};

export default async function Page(props: GoodPageProps) {
  // ✅ тут ми коректно "розгортаємо" проміси
  const { id } = await props.params;
  const searchParams = await props.searchParams;

  if (!id) {
    notFound();
  }

  const reviewsPage = parseInt(searchParams?.reviewsPage ?? "1", 10);
  const validReviewsPage = Math.max(1, reviewsPage);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  try {
    await Promise.all([
      queryClient.fetchQuery({
        queryKey: ["good", id],
        queryFn: () => getGoodByIdServer(id),
      }),
      queryClient.fetchQuery({
        queryKey: ["goodReviews", id, validReviewsPage],
        queryFn: () =>
          getFeedbackByGoodIdServer(id, validReviewsPage, REVIEWS_PER_LOAD),
      }),
    ]);
  } catch (error: any) {
    console.log("Error loading product data:", error);

    const status = error?.response?.status ?? error?.status;

    if (status === 404) {
      notFound();
    }

    if (status >= 500) {
      return (
        <div style={{ color: "red", textAlign: "center", padding: "50px" }}>
          На жаль, виникла помилка при завантаженні даних.
        </div>
      );
    }
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <GoodPageClient goodId={id} reviewsPerPage={REVIEWS_PER_LOAD} />
    </HydrationBoundary>
  );
}
