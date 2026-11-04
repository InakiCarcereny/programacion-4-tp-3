import userEvent from "@testing-library/user-event";

import { delay, http, HttpResponse } from "msw";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { server } from "@/mocks/server";

const productos = [
  { id: "Espresso-1", name: "Expreso Pocillo Brasil", basePrice: 5000, finalPrice: 5900 },
  { id: "Pastry-1", name: "Muffin de chocolate", basePrice: 2500, finalPrice: 2500 },
];

describe("menu loaded from the api", () => {
  it("shows a loading indicator while the menu loads", async () => {
    server.use(
      http.get("/api/products", async () => {
        await delay(100);
        return HttpResponse.json(productos);
      }),
    );

    render(<App />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(await screen.findByText("Expreso Pocillo Brasil")).toBeInTheDocument();
  });

  it("renders every product with its price coming from the api", async () => {
    server.use(http.get("/api/products", () => HttpResponse.json(productos)));

    render(<App />);

    expect(await screen.findByText("Muffin de chocolate")).toBeInTheDocument();
    expect(screen.getByText("$5.900")).toBeInTheDocument();
    expect(screen.getByText("$2.500")).toBeInTheDocument();
  });

  it("shows the api message when the menu fails to load", async () => {
    server.use(
      http.get("/api/products", () =>
        HttpResponse.json({ error: "Error interno de servidor" }, { status: 500 }),
      ),
    );

    render(<App />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Error interno de servidor");
  });
});

describe("menu retry", () => {
  it("reloads the menu when the retry button is pressed", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(
        "/api/products",
        () => HttpResponse.json({ error: "Error interno de servidor" }, { status: 500 }),
        { once: true },
      ),
    );

    render(<App />);

    await screen.findByRole("alert");
    await user.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText("Expreso Pocillo Brasil")).toBeInTheDocument();
  });
});

describe("menu contract", () => {
  it("shows an error when the response does not match the contract", async () => {
    server.use(
      http.get("/api/products", () =>
        HttpResponse.json([{ id: 1, nombre: "campo que no existe" }]),
      ),
    );

    render(<App />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/contrato/i);
  });
});
