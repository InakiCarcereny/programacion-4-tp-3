import type { CartAction, CartState } from "@/types/cart";

export const initialCartState: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((item) => item.product.id === action.product.id);

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }

      return {
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }

    case "INCREMENT": {
      return {
        items: state.items.map((item) =>
          item.product.id === action.productId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      };
    }

    case "DECREMENT": {
      return {
        items: state.items
          .map((item) =>
            item.product.id === action.productId ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case "REMOVE": {
      return {
        items: state.items.filter((item) => item.product.id !== action.productId),
      };
    }

    case "CLEAR": {
      return { items: [] };
    }

    default:
      return state;
  }
}

export function getSubtotal(state: CartState): number {
  return state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}
