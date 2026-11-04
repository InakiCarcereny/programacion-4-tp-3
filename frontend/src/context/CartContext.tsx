import type { ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";
import type { CartAction, CartState } from "@/context/cart-reducer";
import { cartReducer, getSubtotal, initialCartState } from "@/context/cart-reducer";

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const subtotal = getSubtotal(state);

  return (
    <CartContext.Provider value={{ state, dispatch, subtotal }}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
