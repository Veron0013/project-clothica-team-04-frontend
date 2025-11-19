import { nextAuthServer } from './api';
import { User } from '@/types/user';
import { Order } from '@/types/orders';
import { AxiosError } from 'axios';

export type ApiResponse<T> = { data: T };

export type AuthValues = {
  name?: string;
  phone: string;
  password: string;
};

export type ResetPasswordSendmailRequest = {
  email: string;
  phone: string;
};

export type ResetPasswordSendmailResponse = {
  data: { message: string };
  status: number;
};

export type ResetPasswordResponseData = {
  message: string;
  status: number;
};

export type RestorePasswordRequest = {
  token: string;
  password: string;
};

export type RestorePasswordResponse = {
  data: { message: string };
  status: number;
};

export type UpdateUserRequest = {
  username?: string;
  name?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  city?: string;
  warehoseId?: string;
  warehoseNumber?: string;
  avatar?: File | null;
};

export type UploadResponse = { url: string };

export const checkSession = async (): Promise<void> => {
  try {
    const res = await nextAuthServer.get<{ message: string }>('/auth/me');
    if (!res.data || res.data.message !== 'OK') {
      throw new Error('Не вдалося оновити сесію.');
    }
  } catch {
    throw new Error('Неможливо оновити сесію.');
  }
};

export const getUsersMe = async (): Promise<User> => {
  try {
    const res = await nextAuthServer.get('/users/me');
    //console.log("GET USERS ME RESPONSE:", res);
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //console.log("GET USERS ME ERROR:", err);
    throw new Error('Не вдалося отримати користувача');
  }
};

export const login = async (payload: AuthValues): Promise<User> => {
  try {
    const res = await nextAuthServer.post<User>('/auth/login', payload);

    if (!res.data) {
      throw new Error('NO_USER_DATA');
    }

    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse<{ message?: string }>>;

    if (err.response?.status === 401) {
      throw new Error('Невірний телефон або пароль.');
    }

    if (err instanceof Error && err.message === 'NO_USER_DATA') {
      throw new Error('Не вдалося отримати дані користувача.');
    }

    throw new Error('Помилка під час авторизації. Спробуйте пізніше.');
  }
};

export const register = async (payload: AuthValues): Promise<User> => {
  try {
    const res = await nextAuthServer.post<User>('/auth/register', payload);
    if (!res.data) {
      throw new Error('Не вдалося зареєструвати користувача.');
    }
    return res.data;
  } catch {
    throw new Error('Помилка під час реєстрації.');
  }
};

export const callAuth = async (
  isLogin: boolean,
  values: AuthValues
): Promise<User> => (isLogin ? login(values) : register(values));

export const logout = async (): Promise<void> => {
  try {
    await nextAuthServer.post('/auth/logout');
  } catch {
    console.warn('Сервер недоступний під час виходу.');
  }
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  try {
    const form = new FormData();
    (Object.keys(payload) as Array<keyof UpdateUserRequest>).forEach(key => {
      const value = payload[key];
      if (value !== undefined && value !== null) form.append(key, value);
    });

    const res = await nextAuthServer.patch<User>('/users/me', form);
    if (!res.data) {
      throw new Error('Не вдалося оновити профіль.');
    }
    return res.data;
  } catch {
    throw new Error('Помилка під час оновлення профілю.');
  }
};

export const updateAvatar = async (formData: FormData) => {
  return nextAuthServer.patch('/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const sendOrder = async (payload: Order): Promise<Order> => {
  try {
    const res = await nextAuthServer.post<Order>('/order', payload);
    if (!res.data) {
      throw new Error('Не вдалося оформити замовлення.');
    }
    return res.data;
  } catch {
    throw new Error('Помилка під час оформлення замовлення.');
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const form = new FormData();
    form.append('file', file);

    const res = await nextAuthServer.post<UploadResponse>('/upload', form);
    if (!res.data?.url) {
      throw new Error('Не вдалося завантажити зображення.');
    }
    return res.data.url;
  } catch {
    throw new Error('Помилка під час завантаження зображення.');
  }
};

export const passwordSendMail = async (
  payload: ResetPasswordSendmailRequest
): Promise<ResetPasswordResponseData> => {
  try {
    const res = await nextAuthServer.post<ResetPasswordSendmailResponse>(
      '/auth/request-reset-pwd',
      payload
    );

    if (!res.data) {
      throw new Error('Не вдалося надіслати лист.');
    }

    const resData = {
      message: res.data.data.message,
      status: res.status,
    };
    return resData;
  } catch {
    throw new Error('Помилка під час надсилання листа.');
  }
};

export const resetPassword = async (
  payload: RestorePasswordRequest
): Promise<ResetPasswordResponseData> => {
  try {
    const res = await nextAuthServer.post<RestorePasswordResponse>(
      '/auth/reset-password',
      payload
    );

    if (!res.data) {
      throw new Error('Не вдалося скинути пароль.');
    }

    const resData = {
      message: res.data.data.message,
      status: res.status,
    };
    return resData;
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (e.message.includes('401')) {
        throw new Error('Токен недійсний або його термін дії минув.');
      }
    }
    throw new Error('Не вдалося змінити пароль.');
  }
};
