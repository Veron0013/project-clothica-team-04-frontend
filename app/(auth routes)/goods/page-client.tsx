"use client";

import { GoodsList, GoodsListItem } from "@/components/GoodsList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const mock: GoodsListItem[] = [
  { id: "1", title: "Базова футболка", price: 1499, image: "/img/a.jpg" },
  { id: "2", title: "Класичне худі", price: 1999, image: "/img/b.jpg" },
  { id: "3", title: "Джинси Relaxed Fit", price: 2499, image: "/img/c.jpg" },
];

const ProductsPageClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const LOAD_STEP = 3;
  const offset = Number(sp.get("offset") ?? 0);

  function replaceParams(mutator: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(sp.toString());
    mutator(next);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function onLoadMore() {
    replaceParams((next) => {
      const curr = Number(next.get("offset") ?? 0);
      next.set("offset", String(curr + LOAD_STEP));
    });
  }

  function onResetFilters() {
    replaceParams((next) => {
      ["category", "gender", "size", "color"].forEach((k) => next.delete(k));
      next.set("offset", "0");
    });
  }

  const shown = Math.min(mock.length, offset + LOAD_STEP + 3);
  const items = mock.slice(0, shown);
  const total = mock.length;

  return (
    <>
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Знайди свій стиль з Clothica вже сьогодні!
        </h1>
        <p className="max-w-md text-lg leading-8 text-foreground">
          Clothica — це місце, де комфорт поєднується зі стилем. Ми створюємо базовий одяг, який легко комбінується та
          підходить для будь-якої нагоди. Обирай речі, що підкреслять твою індивідуальність і завжди будуть актуальними.
        </p>
        <GoodsList
          items={items}
          total={total}
          isLoading={false}
          isError={false}
          onLoadMore={onLoadMore}
          onResetFilters={onResetFilters}
        />
      </div>
    </>
  )
}

export default ProductsPageClient
