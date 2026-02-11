// import { CartItem } from "@/types/cart";
// import { Product } from "@/types/data";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { createContext, useContext, useEffect, useReducer } from "react";

// const STORAGE_KEY = "@drksde_cart_items";

// type CartState = {
//   items: CartItem[];
//   hydrated: boolean;
// };

// type CartAction =
//   | { type: "ADD"; product: Product }
//   | { type: "REMOVE"; productId: number; variantId?: number }
//   | { type: "INCREMENT"; productId: number; variantId?: number }
//   | { type: "DECREMENT"; productId: number; variantId?: number }
//   | { type: "CLEAR" }
//   | { type: "HYDRATE"; items: CartItem[] };

// const isSameCartItem = (a: CartItem, product: Product) => {
//   return (
//     a.product.product_id === product.product_id &&
//     a.product.selectedVariant?.variant_id ===
//       product.selectedVariant?.variant_id
//   );
// };

// const CartContext = createContext<{
//   state: CartState;
//   dispatch: React.Dispatch<CartAction>;
// } | null>(null);

// const initialState: CartState = {
//   items: [],
//   hydrated: false,
// };

// function cartReducer(state: CartState, action: CartAction): CartState {
//   switch (action.type) {
//     case "HYDRATE":
//       return {
//         items: action.items,
//         hydrated: true,
//       };

//     case "ADD": {
//       const existing = state.items.find((i) =>
//         isSameCartItem(i, action.product),
//       );

//       if (existing) {
//         return {
//           ...state,
//           items: state.items.map((i) =>
//             isSameCartItem(i, action.product)
//               ? { ...i, quantity: i.quantity + 1 }
//               : i,
//           ),
//         };
//       }

//       return {
//         ...state,
//         items: [
//           ...state.items,
//           {
//             product: action.product,
//             quantity: 1,
//           },
//         ],
//       };
//     }

//     case "INCREMENT":
//       return {
//         ...state,
//         items: state.items.map((i) =>
//           i.product.product_id === action.productId
//             ? { ...i, quantity: i.quantity + 1 }
//             : i,
//         ),
//       };

//     case "DECREMENT":
//       return {
//         ...state,
//         items: state.items
//           .map((i) =>
//             i.product.product_id === action.productId
//               ? { ...i, quantity: i.quantity - 1 }
//               : i,
//           )
//           .filter((i) => i.quantity > 0),
//       };

//     case "REMOVE":
//       return {
//         ...state,
//         items: state.items.filter(
//           (i) => i.product.product_id !== action.productId,
//         ),
//       };

//     case "CLEAR":
//       return { ...state, items: [] };

//     default:
//       return state;
//   }
// }

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   useEffect(() => {
//     const loadCart = async () => {
//       try {
//         const stored = await AsyncStorage.getItem(STORAGE_KEY);
//         if (stored) {
//           dispatch({
//             type: "HYDRATE",
//             items: JSON.parse(stored),
//           });
//         } else {
//           dispatch({ type: "HYDRATE", items: [] });
//         }
//       } catch (err) {
//         console.error("LOAD CART ERROR:", err);
//         dispatch({ type: "HYDRATE", items: [] });
//       }
//     };

//     loadCart();
//   }, []);
//   useEffect(() => {
//     if (!state.hydrated) return;

//     AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(
//       (err) => console.error("SAVE CART ERROR:", err),
//     );
//   }, [state.items, state.hydrated]);

//   return (
//     <CartContext.Provider value={{ state, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within CartProvider");
//   }
//   return context;
// }

import { CartItem, CartProduct } from "@/types/cart";
import { Product } from "@/types/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useReducer } from "react";

const STORAGE_KEY = "@drksde_cart_items";

/* -------------------- TYPES -------------------- */

type CartState = {
  items: CartItem[];
  hydrated: boolean;
};

type CartAction =
  | { type: "ADD"; product: CartProduct }
  | { type: "REMOVE"; productId: number; variantId?: number }
  | { type: "INCREMENT"; productId: number; variantId?: number }
  | { type: "DECREMENT"; productId: number; variantId?: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

/* -------------------- HELPERS -------------------- */

const isSameCartItem = (item: CartItem, product: CartProduct) => {
  return (
    item.product.product_id === product.product_id &&
    item.product.selectedVariant?.variant_id ===
      product.selectedVariant?.variant_id
  );
};

const matchById = (item: CartItem, productId: number, variantId?: number) => {
  return (
    item.product.product_id === productId &&
    item.product.selectedVariant?.variant_id === variantId
  );
};

/* -------------------- CONTEXT -------------------- */

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const initialState: CartState = {
  items: [],
  hydrated: false,
};

/* -------------------- REDUCER -------------------- */

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return {
        items: action.items,
        hydrated: true,
      };

    case "ADD": {
      const existing = state.items.find((i) =>
        isSameCartItem(i, action.product),
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            isSameCartItem(i, action.product)
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }

    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          matchById(i, action.productId, action.variantId)
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      };

    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((i) =>
            matchById(i, action.productId, action.variantId)
              ? { ...i, quantity: i.quantity - 1 }
              : i,
          )
          .filter((i) => i.quantity > 0),
      };

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (i) => !matchById(i, action.productId, action.variantId),
        ),
      };

    case "CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
}

/* -------------------- PROVIDER -------------------- */

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from storage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        dispatch({
          type: "HYDRATE",
          items: stored ? JSON.parse(stored) : [],
        });
      } catch (err) {
        console.error("LOAD CART ERROR:", err);
        dispatch({ type: "HYDRATE", items: [] });
      }
    };

    loadCart();
  }, []);

  // Persist cart
  useEffect(() => {
    if (!state.hydrated) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(
      (err) => console.error("SAVE CART ERROR:", err),
    );
  }, [state.items, state.hydrated]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

/* -------------------- HOOK -------------------- */

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
