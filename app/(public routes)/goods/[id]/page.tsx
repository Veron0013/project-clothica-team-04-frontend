import PageClient from "./PageClient";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main>
      <PageClient productId="675a1c0e0f9a2d0012345678" category="shoes" />
    </main>
  );
}

const GoodIdPage = async () => {
  //await queryClient.prefetchQuery({
  //	queryKey: ["GoodsByCategories", page],
  //	queryFn: () => getGoods({ perPage: 12, page }),
  //})

  //const goods = await getGoods({ perPage: 12, page })

  return (
    <></>
    //<HydrationBoundary state={dehydrate(queryClient)}>
    //<ProductsPageClient />
    //</HydrationBoundary>
  );
};

// export default GoodIdPage;
