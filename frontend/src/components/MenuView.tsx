import { CoffeeSection } from "@/components/CoffeeSection";
import { PastrySection } from "@/components/PastrySection";
import { useMenu } from "@/hooks/useMenu";
import { formatPrecio } from "@/lib/price";

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

  return (
    <>
      <section aria-labelledby="menu-heading">
        <h2 id="menu-heading" className="fs-2 fw-light mb-2 font-display">
          Menú
        </h2>
        <ul className="list-unstyled d-flex flex-column gap-2 mb-3">
          {state.productos.map((producto) => (
            <li key={producto.id} className="d-flex justify-content-between gap-2">
              <span>{producto.name}</span>
              <span>{formatPrecio(producto.finalPrice)}</span>
            </li>
          ))}
        </ul>
      </section>

      <CoffeeSection />
      <PastrySection />
    </>
  );
}
