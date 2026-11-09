import userEvent from "@testing-library/user-event";

import { delay, http, HttpResponse } from "msw";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { productsFixture } from "@/mocks/fixtures";
import { server } from "@/mocks/server";

describe("menu loaded from the api", () => {
  it("shows a loading indicator while the menu loads", async () => {
    server.use(
      http.get("/api/products", async () => {
        await delay(100);
        return HttpResponse.json(productsFixture);
      }),
    );

    render(<App />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Café" })).toBeInTheDocument();
  });

  it("renders coffee prices and pastries from the api", async () => {
    const user = userEvent.setup();
    server.use(http.get("/api/products", () => HttpResponse.json(productsFixture)));

    render(<App />);

    await screen.findByRole("heading", { name: "Café" });
    const menu = screen.getByRole("region", { name: "Menú" });

    await user.click(within(menu).getByRole("button", { name: "Expreso" }));
    await user.click(within(menu).getByRole("button", { name: "Mediano" }));

    expect(within(menu).getByRole("button", { name: /Colombia/i })).toHaveTextContent("$7.360");
    expect(within(menu).getByText("Muffin de chocolate")).toBeInTheDocument();
    expect(within(menu).getByText("$2.500")).toBeInTheDocument();
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

    expect(await screen.findByRole("heading", { name: "Café" })).toBeInTheDocument();
  });
});

describe("menu contract", () => {
  it("shows an error when the response does not match the contract", async () => {
    server.use(
      http.get("/api/products", () => HttpResponse.json([{ id: 1, name: "campo que no existe" }])),
    );

    render(<App />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/contrato/i);
  });
});
