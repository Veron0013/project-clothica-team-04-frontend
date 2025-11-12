// app/(public routes)/goods/[id]/page.tsx
import PageClient from "./PageClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ⬅️ розпаковуємо Promise

  return (
    <main>
      <PageClient productId={id} /* category="690c9ce6..." */ />
    </main>
  );
}
