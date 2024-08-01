import { Product } from "./product";

export class CartItem extends Product {
    override isInCart = true;
  }