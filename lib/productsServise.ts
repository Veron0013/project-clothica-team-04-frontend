export const GENDERS = ["male", "female", "unisex"] as const;
export const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"] as const;
export const COLORS = [
  "white",
  "black",
  "grey",
  "blue",
  "green",
  "red",
  "pastel",
] as const;

export type goodsSize = typeof SIZES[number];
export type goodsGender = typeof GENDERS[number];
export type goodsColor = typeof COLORS[number];

export interface GoodsFilter {
  size?: goodsSize[];        // множественный выбор размеров
  gender?: goodsGender;      // один из GENDERS
  color?: goodsColor[];      // множественный выбор цветов
  price_from?: number;       // нижняя граница цены
  price_to?: number;         // верхняя граница цены
}
