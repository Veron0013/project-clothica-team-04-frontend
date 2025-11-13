'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import GoodForPurchase from '@/components/GoodForPurchase/GoodForPurchase';
import GoodReviews from '@/components/GoodReviews/GoodReviews';
import Loader from '@/app/loading';
import MessageNoInfo from '@/components/MessageNoInfo/MessageNoInfo';
import { Good } from '@/types/goods';
import { getGoodByIdClient } from '@/lib/productsServise';
import styles from './GoodPage.module.css';

interface GoodPageClientProps {
  goodId: string;
  reviewsPerPage: number;
}

export default function GoodPageClient({ goodId, reviewsPerPage }: GoodPageClientProps) {

   const { data: good, isLoading, isError, isFetched } = useQuery<Good>({
    queryKey: ['good', goodId],
    queryFn: () => getGoodByIdClient(goodId),
    staleTime: 1000 * 60 * 5,
    enabled: !!goodId,
  });

    if (isLoading) {
    return <Loader />;
  }

  if (isError || !good) {
    return (
      <div className={styles.centerContainer}>
          <MessageNoInfo
          text="На жаль, товар не знайдено, або виникла помилка завантаження."
          buttonText="До покупок"
          route="/goods"
        />
      </div>
    );
  }

    return (
    <main className={styles.main}>
      <div className={styles.container}>
        
        <GoodForPurchase good={good} />
        <GoodReviews goodId={goodId} reviewsPerPage={reviewsPerPage} />
                
      </div>
    </main>
  );
}

