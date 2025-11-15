import { CategoriesResponse } from "@/types/categories";
import { AllFilters } from "@/types/filters";
import {
  BasketStoreGood,
  Good,
  GoodsQuery,
  GoodsResponse,
} from "@/types/goods";
import { Order } from "@/types/orders";
import { UpdateMeRequest, User } from "@/types/user";
import axios, { AxiosError } from "axios";

export type ApiError = AxiosError<{ error: string }>;

export const nextServer = axios.create({
  //baseURL: process.env.NEXT_PUBLIC_API_URL + "/",
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const getGoods = async (
  searchParams: GoodsQuery
): Promise<GoodsResponse> => {
  const response = await nextServer.get("/goods", { params: searchParams });
  return response.data;
};

export type BasketGoodsParams = {
  goodIds: Good["_id"][];
};

export const getGoodsFromArray = async (
  query: BasketGoodsParams
): Promise<BasketStoreGood[]> => {
  const response = await nextServer.post("/goods/from-array", query);
  return response.data;
};

export const getCategories = async (
  page: number,
  limit?: number
): Promise<CategoriesResponse> => {
  const response = await nextServer.get("/categories", {
    params: { page, limit },
  });

  return response.data;
};

export const getFilterOptions = async (): Promise<AllFilters> => {
  const response = await nextServer.get("/goods/all-filters");
  return response.data;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
	const response = await nextServer.get<Order[]>(`/orders/${userId}`)
	return response.data
}

export const updateMe = async (data: UpdateMeRequest): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", data);
  return res.data;
};