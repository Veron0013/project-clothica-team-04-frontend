'use client';

import { GoodsList } from '@/components/GoodsList';
import { getFilterOptions, getGoods } from '@/lib/api/api';
import toastMessage, { MyToastType } from '@/lib/messageService';
import { CLEAR_FILTERS, PER_PAGE } from '@/lib/vars';
import { Good, GoodsQuery, QueryRecord } from '@/types/goods';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';

import MessageNoInfo from '@/components/MessageNoInfo/MessageNoInfo';
import FilterPanel from '@/components/Filters/FilterPanel';
import Loading from '@/app/loading';
import css from './page-client.module.css';
import { AllFilters, AllSortData } from '@/types/filters';
import SortDropdown from '@/components/SortDropdown/SortDropdown';

const ProductsPageClient = () => {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  const [displayedGoods, setDisplayedGoods] = useState<Good[]>([]);
  const [dataQty, setDataQty] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<string>('Всі товари');
  const [filters, setFilters] = useState<AllFilters | null>(null);

  const limit = PER_PAGE;
  const initialSearch = sp.get('search') || '';
  const initialSort = (sp.get('sort') as keyof AllSortData) || 'price_asc';

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [selectedSort, setSelectedSort] =
    useState<keyof AllSortData>(initialSort);

  // зберігаємо попередній limit для анімації нових товарів
  const prevLimit = useRef(Number(sp.get('limit')) || limit);

  const searchParams: GoodsQuery = useMemo(() => {
    const params: QueryRecord = {
      limit: Number(sp.get('limit')) || limit,
      page: 1,
    };

    for (const key of sp.keys()) {
      const allValues = sp.getAll(key);
      params[key] = allValues.length > 1 ? allValues : allValues[0];
    }

    //console.log('params', params);
    return params as GoodsQuery;
  }, [sp, limit]);

  const { data, isFetching } = useQuery({
    queryKey: ['GoodsByCategories', searchParams],
    queryFn: async () => {
      const res = await getGoods(searchParams);
      if (!res) toastMessage(MyToastType.error, 'bad request');
      return res;
    },
    refetchOnMount: false,
  });

  useEffect(() => {
    if (!data) return;
    //console.log('filters', data?.goods.length);
    const fetchGoods = () => {
      const newItemsCount = data.goods.length - prevLimit.current;
      setDataQty(newItemsCount > 0 ? newItemsCount : data.goods.length);

      setDisplayedGoods(data.goods);
      prevLimit.current = data.goods.length;
    };
    fetchGoods();
  }, [data]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getFilterOptions();
        setFilters(data);
      } catch (error) {
        console.error('Не вдалося завантажити фільтри:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchSearch = () => {
      if (sp.toString() === '') {
        setSearchValue('');
      }
      if (sp.get('category') && filters) {
        const catData = filters.categories?.filter(
          item => item._id === sp.get('category')
        );
        if (catData) {
          setCurrentCategory(catData ? catData[0].name : 'Всі товари');
        }
      } else {
        setCurrentCategory('Всі товари');
      }
    };
    fetchSearch();
  }, [sp, filters]);

  const handleShowMore = () => {
    const nextLimit = Number(searchParams.limit) + 3;
    const newParams = new URLSearchParams(sp);
    newParams.set('limit', String(nextLimit));
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const sortOptions: { value: keyof AllSortData; label: string }[] = [
    { value: 'price_asc', label: '💰 Ціна ↑' },
    { value: 'price_desc', label: '💰 Ціна ↓' },
    { value: 'name_asc', label: '🔤 А→Я' },
    { value: 'name_desc', label: '🔤 Я→А' },
  ];

  const debouncedUpdateSearch = useRef(
    debounce((value: string) => {
      const newSp = new URLSearchParams(window.location.search); // актуальні search params
      if (value) newSp.set('search', value);
      else newSp.delete('search');
      newSp.delete('page');

      router.push(`${pathname}?${newSp.toString()}`, { scroll: false });
    }, 300)
  ).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setDisplayedGoods([]); // очищаємо старий список
    debouncedUpdateSearch(value);
  };

  const handleSortChange = (value: keyof AllSortData) => {
    setSelectedSort(value);

    const params = new URLSearchParams(sp.toString());
    params.set('sort', value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  //console.log(displayedGoods[0]);
  return (
    <section className={css.goods}>
      <h1 className={css.title}>{currentCategory}</h1>

      <div className={css.layout}>
        <FilterPanel
          vieved={Math.min(data?.limit || 0, data?.totalGoods || 0)}
          total={data?.totalGoods || 0}
        />

        <div className={css.goodsContent}>
          <div className={css.searchWrapper}>
            <input
              type="text"
              placeholder="Пошук товарів..."
              className={css.searchInput}
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>

          <div className={css.sortWrapper}>
            <SortDropdown
              value={selectedSort}
              options={sortOptions}
              onChange={handleSortChange} // тут твоя логіка оновлення sort + URL
            />
          </div>

          {displayedGoods.length > 0 && (
            <GoodsList items={displayedGoods} dataQty={dataQty} />
          )}

          {isFetching && <Loading />}

          {!isFetching && data && data?.limit < data?.totalGoods && (
            <button
              className={css.cardCta}
              onClick={handleShowMore}
              disabled={isFetching}
            >
              Показати ще
            </button>
          )}

          {data && data?.totalGoods === 0 && (
            <MessageNoInfo
              buttonText="Скинути фільтри"
              text={CLEAR_FILTERS}
              route="/goods"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsPageClient;
