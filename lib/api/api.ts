import { CategoriesResponse } from "@/types/categories";
import { AllFilters } from "@/types/filters";
import { GoodsQuery, GoodsResponse } from "@/types/goods";
import axios, { AxiosError } from "axios";

export type ApiError = AxiosError<{ error: string }>;

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/",
  withCredentials: true,
});

export const getGoods = async (
  searchParams: GoodsQuery
): Promise<GoodsResponse> => {
  const response = await nextServer.get("/goods", { params: searchParams });
  return response.data;
};

export const getCategories = async (
  page: number,
  perPage: number
): Promise<CategoriesResponse> => {
  const response = await nextServer.get("/categories", {
    params: { page, perPage },
  });

  return response.data;
};

export const getFilterOptions = async (): Promise<AllFilters> => {
  const response = await nextServer.get("/goods/all-filters");
  return response.data;
};
