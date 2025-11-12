// app/goods/[id]/PageClient.tsx
"use client";
import { useState } from "react";
import ReviewModal from "@/components/ReviewModal/ReviewModal";

export default function PageClient({
  productId,
  category,
}: {
  productId: string;
  category?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Залишити відгук</button>
      <ReviewModal
        open={open}
        onClose={() => setOpen(false)}
        productId={productId}
        category={category}
      />
    </>
  );
}
