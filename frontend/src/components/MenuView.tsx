import { CoffeeSection } from "@/components/CoffeeSection";
import { PastrySection } from "@/components/PastrySection";
import { useMenu } from "@/hooks/useMenu";
import type { Product } from "@/schemas/products";

type Pastry = Extract<Product, { type: "pasteleria" }>;

export function MenuView(): JSX.Element {
  const { state, retry } = useMenu();

  if (state.status === "cargando") {
    return (
      <div role="status" className="text-center py-4">
        Cargando menú…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div role="alert" className="d-flex flex-column gap-2 align-items-center py-4">
        <p className="mb-0">{state.message}</p>
        <button type="button" className="btn btn-outline-primary" onClick={() => void retry()}>
          Reintentar
        </button>
      </div>
    );
  }

  const pastries = state.products
    .filter((product): product is Pastry => product.type === "pasteleria")
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
    }));

  return (
    <div role="region" aria-label="Menú" className="menu">
      <CoffeeSection products={state.products} />

      <PastrySection pastries={pastries} />
    </div>
  );
}
