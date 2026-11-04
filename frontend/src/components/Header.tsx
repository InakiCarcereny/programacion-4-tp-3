import { getMesaFromUrl } from "@/lib/table";

export function Header(): JSX.Element {
  const mesa = getMesaFromUrl(window.location.search);

  return (
    <header className="bg-primary text-light d-flex justify-content-between align-items-end px-3 py-3 w-100">
      <div className="d-flex flex-column">
        <span className="eyebrow text-secondary">Cafetería</span>

        <span className="fs-2 fw-light lh-1 font-display">Origen</span>
      </div>

      <div className="d-flex flex-column text-end">
        <span className="eyebrow text-secondary">Mesa</span>

        <span className="fw-semibold">{mesa === null ? "Retiro en la barra" : `Mesa ${mesa}`}</span>
      </div>
    </header>
  );
}
