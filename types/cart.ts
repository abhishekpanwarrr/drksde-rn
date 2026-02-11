// import { Product } from "./data";

// export type CartItem = {
//   product: Product & {
//     selectedVariant?: {
//       variant_id: number;
//       sku: string;
//       price_adjustment: number;
//       stock_quantity: number;
//     };
//     final_price: number;
//   };
//   quantity: number;
// };

import { Product } from "./data";

export type CartProduct = Product & {
  selectedVariant?: {
    variant_id: number;
    sku: string;
    price_adjustment: number;
    stock_quantity: number;
  };
  final_price: number;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};
