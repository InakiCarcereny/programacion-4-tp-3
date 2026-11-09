import { CoffeeSection } from "@/components/CoffeeSection";
import { PastrySection } from "@/components/PastrySection";
import { useMenu } from "@/hooks/useMenu";
import type { Pasteleria } from "@/schemas/products";

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

  const pastries = state.productos
    .filter((producto): producto is Pasteleria => producto.tipo === "pasteleria")
    .map((producto) => ({
      id: producto.id,
      name: producto.name,
      price: producto.finalPrice,
    }));

  return (
    <div role="region" aria-label="Menú" className="menu">
      <CoffeeSection productos={state.productos} />

      <PastrySection pastries={pastries} />
    </div>
  );
}
