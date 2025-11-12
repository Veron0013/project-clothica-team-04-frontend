// app/(public routes)/goods/page-client.tsx
"use client";

import { useState } from "react";
import ReviewModal from "@/components/ReviewModal/ReviewModal";

type Props = {
  productId: string;
  category?: string;
};

export default function PageClient({ productId, category }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ padding: "14px 20px", borderRadius: 12, fontWeight: 600 }}
      >
        Залишити відгук
      </button>

      <ReviewModal
        open={open}
        onClose={() => setOpen(false)}
        productId={productId}
        category={category}
      />
    </>
  );
}
