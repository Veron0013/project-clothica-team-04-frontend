// src/api/reviewsApi.ts
import { CreateFeedbackDto, FeedbackPayload } from '@/types/feedback';
import { nextServer } from './api';
import axios, { AxiosError } from 'axios';

const toCreateDto = (f: FeedbackPayload): CreateFeedbackDto => ({
  productId: f.productId,
  description: f.comment,
  author: f.author,
  rate: f.rate,
  category: f.category || undefined,
});

export const getReviews = async () => {
  const response = await nextServer.get('/feedbacks', {
    params: { page: 1, limit: 6 },
  });
  return response.data.items; // або .data, залежно від бекенду
};

export const createFeedbackClient = async (feedback: FeedbackPayload) => {
  try {
    const dto = toCreateDto(feedback);

    const { data } = await nextServer.post('/feedbacks', dto, {
      withCredentials: true,
    });

    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg =
        (err.response?.data as AxiosError)?.message ??
        err.message ??
        'Creating feedback failed';
      throw new Error(msg);
    }
    throw new Error('Creating feedback failed');
  }
};
