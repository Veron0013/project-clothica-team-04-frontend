export type GoodCategory = {
  _id: string;
  name: string;
  image: string;
};

export type Good = {
  _id: string;
  //title: string
  name: string;
  price: number;
  image: string;
  currency: string;
  color?: string[];
  size: string[];
  description: string;
  characteristics: string[];
  gender: string;
  //rating?: number
  //reviewsCount?: number
  category?: GoodCategory;
  prevDescription?: string;
  feedbackCount?: number;
  averageRating?: number;
};

export type BasketStoreOrder = {
  key: string;
  color?: string[];
  size?: string[];
  _id: string;
  name: string;
  price: number;
  image: string;
  currency: string;
  feedbackCount?: number;
  averageRating?: number;
  quantity?: number;
};

export type GoodsResponse = {
  goods: Good[];
  page: number;
  limit: number;
  totalGoods: number;
  totalPages: number;
};

export type GoodsQuery = {
  category?: string;
  size?: string[];
  color?: string[];
  gender?: string;
  limit: number;
  page: number;
};

export type QueryValue = string | number | string[];

export type QueryRecord = Record<string, QueryValue>;
