export interface FeedbackPayload {
  author: string;
  rate: number;
  comment: string;
  productId: string;
  category: string;
}

export type CreateFeedbackDto = {
  productId: string;
  description: string;
  author: string;
  rate: number;
  category?: string;
};
