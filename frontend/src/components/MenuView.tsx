import { CoffeeSection } from "@/components/CoffeeSection";
import { PastrySection } from "@/components/PastrySection";
import { useMenu } from "@/hooks/useMenu";

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
      <CoffeeSection />

      <PastrySection />
    </>
  );
}
