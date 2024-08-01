import { Product } from "./product";

export interface WishList {
    name: string;
    products: Product[];
    createdAt: Date;
  }