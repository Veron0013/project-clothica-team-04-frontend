import { PER_PAGE } from "@/lib/vars";
import { User } from "@/types/user";
import { nextServer } from "./api";
import type { FeedbackPayload } from "@/types/feedback";
import axios from "axios";

//axios.defaults.baseURL = MAIN_URL
//axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
export type LoginRequest = {
  phone: string;
  password: string;
};

export type ResetPasswordSendmailRequest = {
  email: string;
};

export type RestorePasswordRequest = {
  token: string;
  password: string;
};

export type RegisterRequest = {
  phone: string;
  password: string;
  username: string;
};

type CheckSessionRequest = {
  success: boolean;
};

export interface SearchParams {
  search: string;
  page?: number;
  limit?: number;
}

export interface ApiQueryParams {
  params: SearchParams;
}

export type Category = {
  _id: string;
  name: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserRequest = {
  username?: string;
  avatar?: File | null;
};

export const createQueryParams = (
  search = "",
  page = 1,
  tag?: string
): ApiQueryParams => {
  const params: SearchParams = {
    search,
    page,
    limit: PER_PAGE,
  };
  //console.log(tag)
  //if (tag !== "All") {
  //	params.tag = tag as Tag
  //}

  return { params };
};

////////////////////////////////////////

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const refreshSession = await checkSession();
  if (refreshSession) {
    const { data } = await nextServer.get<User>("/users/me");
    return data;
  } else {
    throw new Error(JSON.stringify({ message: "Session expired", code: 401 }));
  }
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const refreshSession = await checkSession();

  if (refreshSession) {
    const formData = new FormData();

    if (payload.username) formData.append("username", payload.username);
    if (payload.avatar) formData.append("avatar", payload.avatar);

    const res = await nextServer.patch<User>("/users/me", formData);
    return res.data;
  } else {
    throw new Error(JSON.stringify({ message: "Session expired", code: 401 }));
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await nextServer.post("/upload", formData);
  return data.url;
};

export const passwordSendMail = async (email: ResetPasswordSendmailRequest) => {
  const res = await nextServer.post("/auth/request-reset-email", email);
  return res;
};

export const resetPassword = async (body: RestorePasswordRequest) => {
  const res = await nextServer.post("/auth/reset-password", body);
  return res;
};

type CreateFeedbackDto = {
  productId: string;
  description: string;
  author: string;
  rate: number;
  category?: string;
};

const toCreateDto = (f: FeedbackPayload): CreateFeedbackDto => ({
  productId: f.goodId,
  description: f.comment,
  author: f.author,
  rate: f.rate,
  category: f.category || undefined,
});

export const createFeedbackClient = async (feedback: FeedbackPayload) => {
  try {
    const dto = toCreateDto(feedback);

    const { data } = await nextServer.post("/feedbacks", dto, {
      withCredentials: true,
    });

    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg =
        (err.response?.data as any)?.message ??
        err.message ??
        "Creating feedback failed";
      throw new Error(msg);
    }
    throw new Error("Creating feedback failed");
  }
};
