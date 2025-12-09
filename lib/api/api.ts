import { CategoriesResponse } from '@/types/categories';
import { AllFilters } from '@/types/filters';
import {
  BasketStoreOrder,
  Good,
  GoodsQuery,
  GoodsResponse,
} from '@/types/goods';
import { Order } from '@/types/orders';
import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

export const nextAuthServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROXY_API_URL + '/api', //    http://localhost:3000
  withCredentials: true,
});

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, //  http://localhost:3030
  withCredentials: true,
});

export const getGoods = async (
  searchParams: GoodsQuery
): Promise<GoodsResponse> => {
  const params = new URLSearchParams();

  //console.log('p1', `/goods?${params.toString()}`);
  // Перетворення для всіх параметрів
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v)); // sizes=XS&sizes=S
    } else if (value !== undefined && value !== null) {
      params.append(key, String(value)); // limit=12
    }
  });

  //const response = await nextServer.get('/goods', { params: searchParams });
  const response = await nextServer.get(`/goods?${params.toString()}`);
  return response.data;
};

export type BasketGoodsParams = {
  goodIds: Good['_id'][];
};

export const getGoodsFromArray = async (
  query: BasketGoodsParams
): Promise<BasketStoreOrder[]> => {
  const response = await nextServer.post('/goods/from-array', query);
  return response.data;
};

export const getCategories = async (
  page: number,
  limit?: number
): Promise<CategoriesResponse> => {
  const response = await nextServer.get('/categories', {
    params: { page, limit },
  });

  return response.data;
};

export const getFilterOptions = async (): Promise<AllFilters> => {
  const response = await nextServer.get('/goods/all-filters');
  return response.data;
};

export const getUserOrders = async (): Promise<Order[]> => {
  const response = await nextAuthServer.get<Order[]>(`/order`);
  return response.data;
};

///////////////////////////////////

// для запиту на заміну пошти
export const requestEmailChange = async (newEmail: string) => {
  const response = await nextServer.post('/auth/change-email-request', {
    newEmail,
  });

  return response.data;
};

export const confirmEmailChange = (token: string) =>
  nextServer.post('/auth/confirm-change-email', { token });
