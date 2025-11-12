export type Category = {
  _id: string;
  name: string;
  image: string;
};

export type CategoriesResponse = {
  page: number;
  perPage: number;
  totalCategories: number;
  totalPages: number;
  categories: Category[];
};
