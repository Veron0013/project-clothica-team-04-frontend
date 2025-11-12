import { cookies } from "next/headers";
import { nextServer } from "@/lib/api/api";
import { Good } from "@/types/goods";
import { FeedbackResponse } from "@/lib/productsServise";

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
};

export const getGoodByIdServer = async (id: string): Promise<Good> => {
  const { data } = await nextServer.get<Good>(`/goods/${id}`);

  return data;
};

export const getFeedbackByGoodIdServer = async (
  id: string,
  page: number,
  perPage: number
): Promise<FeedbackResponse> => {
  const cookieHeaderValue = await getCookieHeader();

  const headers = cookieHeaderValue
    ? { Cookie: await cookieHeaderValue }
    : undefined;

  const { data } = await nextServer.get<FeedbackResponse>(`/feedbacks`, {
    headers,
    params: {
      goodId: id,
      page,
      perPage,
    },
  });
  return data;
};
