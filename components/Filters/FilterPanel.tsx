// components/FilterPanel/FilterPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import Filter from "@/components/Filters/Filter";
import css from "./FilterPanel.module.css";
import { BREAKPOINTS } from "@/lib/vars";
import { AllFilters } from "@/types/filters";
import { getFilterOptions } from "@/lib/api/api";
import Link from "next/link";
import { useIsClient } from "@/lib/hooks/useIsClient";

interface Props {
  vieved: number;
  total: number;
}

export default function FilterPanel({ total, vieved }: Props) {
  const isClient = useIsClient();

  // true, якщо ширина екрана >= 768px (tablet + desktop)
  const isSidebarLayout = useMediaQuery(`(min-width: ${BREAKPOINTS.tablet})`);

  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<AllFilters | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getFilterOptions();
        setFilters(data);
      } catch (error) {
        console.error("Не вдалося завантажити фільтри:", error);
      }
    };

    fetchFilters();
  }, []);

  if (!isClient || !filters) return null;

  return (
    <>
      {isSidebarLayout ? (
        <aside className={css.filterPanelAside}>
          <div className={css.panelContainer}>
            <h3 className={css.title}>Фільтри</h3>
            <Link className={css.clear} href="/goods">
              Очистити всі
            </Link>
          </div>
          <p className={css.text}>
            Показано {vieved} із {total}
          </p>

          <Filter options={filters} variant="sidebar" />
        </aside>
      ) : (
        <>
          <aside className={css.filterPanelAside}>
            <div className={css.onlyMobile}>
              <h3 className={css.title}>Фільтри</h3>
              <Link className={css.clear} href="/goods">
                Очистити всі
              </Link>
            </div>
            <p className={css.text}>
              Показано {vieved} із {total}
            </p>
          </aside>

          <button
            type="button"
            className={`${css.filterPanelButton} ${
              isOpen ? css.filterPanelButtonOpen : ""
            }`}
            onClick={() => setIsOpen((s) => !s)}
            aria-expanded={isOpen}
          >
            <span>Фільтри</span>
            <svg
              className={css.filterPanelButtonIcon}
              width={16}
              height={16}
              aria-hidden="true"
              focusable="false"
            >
              <use
                href={
                  isOpen
                    ? "/sprite.svg#keyboard_arrow_up"
                    : "/sprite.svg#keyboard_arrow_down"
                }
              />
            </svg>
          </button>

          <div
            className={`${css.filterContainer} ${
              isOpen ? css.filterContainerOpen : css.filterContainerClosed
            }`}
          >
            <Filter
              options={filters}
              onClose={() => setIsOpen(false)}
              variant="dropdown"
            />
          </div>
        </>
      )}
    </>
  );
}
