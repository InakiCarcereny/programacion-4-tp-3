import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { Checkout } from "@/components/Checkout";
import { CartProvider } from "@/context/CartContext";
import { server } from "@/mocks/server";
import type { CartState } from "@/types/cart";

const cart: CartState = {
  items: [
    { product: { id: 5, name: "Expreso Mediano Colombia", price: 7360 }, quantity: 2 },
    { product: { id: 19, name: "Muffin de chocolate", price: 2500 }, quantity: 1 },
  ],
};

const pedidoCreado = {
  id: "Order-1",
  mesaId: 4,
  items: [
    { productId: "5", quantity: 2 },
    { productId: "19", quantity: 1 },
  ],
  status: "pending",
  total: 17220,
};

function renderCheckout(): ReturnType<typeof userEvent.setup> {
  const user = userEvent.setup();

  render(
    <CartProvider initialState={cart}>
      <Checkout mesa={4} />
    </CartProvider>,
  );

  return user;
}

function expectCartKept(): void {
  expect(screen.getByText("Expreso Mediano Colombia")).toBeInTheDocument();
  expect(screen.getByText("Muffin de chocolate")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Confirmar pedido" })).toBeEnabled();
}

describe("order rejected by the api", () => {
  it("shows the api message and keeps the cart on a 4xx error", async () => {
    server.use(
      http.post("/api/orders", () =>
        HttpResponse.json({ error: "Producto 19 no encontrado" }, { status: 404 }),
      ),
    );
    const user = renderCheckout();

    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Producto 19 no encontrado");
    expectCartKept();
  });

  it("shows the message of a 400 validation error", async () => {
    server.use(
      http.post("/api/orders", () =>
        HttpResponse.json({ error: "La mesa 99 no existe" }, { status: 400 }),
      ),
    );
    const user = renderCheckout();

    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("La mesa 99 no existe");
    expect(screen.queryByRole("button", { name: "Reintentar" })).not.toBeInTheDocument();
  });
});

describe("server error with retry", () => {
  it("lets the client retry after a 500 and confirms the same cart", async () => {
    const bodies: unknown[] = [];
    server.use(
      http.post(
        "/api/orders",
        async ({ request }) => {
          bodies.push(await request.json());
          return HttpResponse.json({ error: "Error interno de servidor" }, { status: 500 });
        },
        { once: true },
      ),
      http.post("/api/orders", async ({ request }) => {
        bodies.push(await request.json());
        return HttpResponse.json(pedidoCreado, { status: 201 });
      }),
    );
    const user = renderCheckout();

    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Error interno de servidor");
    expectCartKept();

    await user.click(within(alert).getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByRole("heading", { name: "Pedido confirmado" })).toBeInTheDocument();
    expect(bodies).toHaveLength(2);
    expect(bodies[1]).toEqual(bodies[0]);
  });
});

describe("api down", () => {
  it("shows a connection message, keeps the cart and allows a retry", async () => {
    server.use(
      http.post("/api/orders", () => HttpResponse.error(), { once: true }),
      http.post("/api/orders", () => HttpResponse.json(pedidoCreado, { status: 201 })),
    );
    const user = renderCheckout();

    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/no pudimos conectar/i);
    expectCartKept();

    await user.click(within(alert).getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByRole("heading", { name: "Pedido confirmado" })).toBeInTheDocument();
  });
});

describe("order response out of contract", () => {
  it("shows a contract error and keeps the cart", async () => {
    server.use(http.post("/api/orders", () => HttpResponse.json({ ok: true }, { status: 201 })));
    const user = renderCheckout();

    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/contrato/i);
    expectCartKept();
  });
});
