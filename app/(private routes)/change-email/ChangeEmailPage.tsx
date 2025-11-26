'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { confirmEmailChange } from '@/lib/api/api';
import css from './ChangeEmailPage.module.css';

type StatusType = 'loading' | 'success' | 'error' | 'missing';

export default function ChangeEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? undefined;

  const { error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['confirm-email', token],
    queryFn: () => confirmEmailChange(token!),
    enabled: !!token, // запускається ТІЛЬКИ якщо є token
    retry: false, // токен не треба автоматично повторювати
  });

  let status: StatusType = 'loading';
  let message = '';

  if (!token) {
    status = 'missing';
    message = 'Токен не передано.';
  } else if (isLoading) {
    status = 'loading';
    message = 'Будь ласка, зачекайте.';
  } else if (isError) {
    status = 'error';
    message =
      (error as any)?.response?.data?.message ||
      'Недійсний або прострочений токен.';
  } else if (isSuccess) {
    status = 'success';
    message = 'Ваш email успішно змінено!';
  }

  return (
    <div className={css.container}>
      <div className={css.card}>
        {status === 'loading' && (
          <>
            <h2>Підтвердження зміни email…</h2>
            <p>{message}</p>
          </>
        )}

        {status === 'missing' && (
          <>
            <h2>Помилка</h2>
            <p>{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <h2>Помилка підтвердження</h2>
            <p>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h2>Email змінено!</h2>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
