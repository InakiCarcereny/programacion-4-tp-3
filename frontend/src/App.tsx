import { useState } from "react";
import { Checkout } from "@/components/Checkout";
import { Header } from "@/components/Header";
import { MenuView } from "@/components/MenuView";
import { CartProvider } from "@/context/CartContext";
import { getMesaFromUrl } from "@/utils/table";

type View = "menu" | "cart";

export default function App(): JSX.Element {
  const [view, setView] = useState<View>("menu");

  const handleChange = (view: View): void => {
    setView(view);
  };

  const views: Record<View, JSX.Element> = {
    menu: <MenuView />,
    cart: (
      <Checkout mesa={getMesaFromUrl(window.location.search)} onBack={() => handleChange("menu")} />
    ),
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
