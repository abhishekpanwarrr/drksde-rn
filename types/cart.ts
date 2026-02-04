import { Product } from "./data";

export interface CartItem {
  product: Product;
  quantity: number;
}
