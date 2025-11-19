'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { updateAvatar } from '@/lib/api/clientApi';
import { useAuthStore } from '@/stores/authStore';
import css from './AvatarEditor.module.css';

export default function AvatarEditor() {
  const user = useAuthStore(state => state.user);

  const [preview, setPreview] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateAvatar(formData),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('avatar', file);

    mutation.mutate(formData);
  };

  return (
    <div className={css.wrapper}>
      <div className={css.avatarBox}>
        <Image
          src={preview || user?.avatar || '/default-avatar.png'}
          alt="User avatar"
          width={140}
          height={140}
          className={css.avatar}
        />
      </div>

      <label className={css.button}>
        Змінити аватар
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </label>

      {mutation.isPending && <p className={css.loading}>Завантаження...</p>}
    </div>
  );
}
