import { useState } from "react";
import { CartView } from "@/components/CartView";
import { DoneView } from "@/components/DoneView";
import { Header } from "@/components/Header";
import { MenuView } from "@/components/MenuView";
import { CartProvider } from "@/context/CartContext";

type View = "menu" | "cart" | "done";

export default function App(): JSX.Element {
  const [view, setView] = useState<View>("menu");

  const handleChange = (view: View): void => {
    setView(view);
  };

  const views: Record<View, JSX.Element> = {
    menu: <MenuView />,
    cart: <CartView />,
    done: <DoneView />,
  };

  return (
    <CartProvider>
      <div className="mx-auto app-shell">
        <Header />

        <main className="d-flex flex-column justify-content-between px-3 py-3 flex-grow-1">
          {views[view]}
        </main>
      </div>
    </CartProvider>
  );
}
