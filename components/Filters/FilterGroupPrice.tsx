"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import css from "./FilterGroupPrice.module.css";

type FilterGroupPriceProps = {
  className?: string;
};

const MIN = 0;
const MAX = 50000;

export default function FilterGroupPrice({ className }: FilterGroupPriceProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialMin = Number(searchParams.get("fromPrice")) || MIN;
  const initialMax = Number(searchParams.get("toPrice")) || MAX;

  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);

  useEffect(() => {
    setMinPrice(initialMin);
    setMaxPrice(initialMax);
  }, [initialMin, initialMax]);

  const updateUrl = (from: number, to: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("fromPrice", String(from));
    params.set("toPrice", String(to));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleMinChange = (value: number) => {
    const safe = Math.min(Math.max(value, MIN), maxPrice - 1);
    setMinPrice(safe);
    updateUrl(safe, maxPrice);
  };

  const handleMaxChange = (value: number) => {
    const safe = Math.max(Math.min(value, MAX), minPrice + 1);
    setMaxPrice(safe);
    updateUrl(minPrice, safe);
  };

  const handleClear = () => {
    setMinPrice(MIN);
    setMaxPrice(MAX);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("fromPrice");
    params.delete("toPrice");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const minPercent = ((minPrice - MIN) / (MAX - MIN)) * 100;
  const maxPercent = ((maxPrice - MIN) / (MAX - MIN)) * 100;

  const rootClassName = className
    ? `${css.filterPrice} ${className}`
    : css.filterPrice;

  return (
    <section className={rootClassName} aria-label="Фільтр за ціною">
      <div className={css.headerRow}>
        <h4 className={css.title}>Ціна</h4>
        <button type="button" className={css.clearBtn} onClick={handleClear}>
          Очистити
        </button>
      </div>

      <div className={css.sliderWrapper}>
        {/* фонова лінія + активний відрізок */}
        <div
          className={css.sliderTrack}
          style={
            {
              "--start": `${minPercent}%`,
              "--end": `${maxPercent}%`,
            } as React.CSSProperties
          }
        />

        {/* два range поверх однієї лінії */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={minPrice}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className={css.range}
        />

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={maxPrice}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className={css.range}
        />
      </div>

      <div className={css.valuesRow}>
        <span>{MIN}</span>
        <span>{MAX}</span>
      </div>
    </section>
  );
}
