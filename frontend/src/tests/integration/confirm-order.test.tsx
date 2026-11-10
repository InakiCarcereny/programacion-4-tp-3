import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
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
    { productId: 5, quantity: 2 },
    { productId: 19, quantity: 1 },
  ],
  status: "pending",
  total: 17220,
};

function renderCheckout(mesa: number | null = 4): void {
  render(
    <CartProvider initialState={cart}>
      <Checkout mesa={mesa} />
    </CartProvider>,
  );
}

describe("confirm order", () => {
  it("sends the table and the cart items to POST /orders", async () => {
    const user = userEvent.setup();
    let body: unknown;
    server.use(
      http.post("/api/orders", async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(pedidoCreado, { status: 201 });
      }),
    );

    renderCheckout();
    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    await screen.findByRole("heading", { name: "Pedido confirmado" });
    expect(body).toEqual({
      mesaId: 4,
      items: [
        { productId: 5, quantity: 2 },
        { productId: 19, quantity: 1 },
      ],
    });
  });

  it("sends a bar order when there is no table", async () => {
    const user = userEvent.setup();
    let body: unknown;
    server.use(
      http.post("/api/orders", async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ ...pedidoCreado, mesaId: null }, { status: 201 });
      }),
    );

    renderCheckout(null);
    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    await screen.findByRole("heading", { name: "Pedido confirmado" });
    expect(body).toHaveProperty("mesaId", null);
  });

  it("shows the order number, status and total returned by the api", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("/api/orders", () =>
        HttpResponse.json({ ...pedidoCreado, total: 99999 }, { status: 201 }),
      ),
    );

    renderCheckout();
    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    await screen.findByRole("heading", { name: "Pedido confirmado" });
    expect(screen.getByText("Order-1")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getByText("$99.999")).toBeInTheDocument();
  });

  it("shows that the order is being sent and does not send it twice", async () => {
    const user = userEvent.setup();
    let requests = 0;
    server.use(
      http.post("/api/orders", async () => {
        requests += 1;
        await delay(100);
        return HttpResponse.json(pedidoCreado, { status: 201 });
      }),
    );

    renderCheckout();
    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));
    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    expect(screen.getByRole("status")).toHaveTextContent("Enviando pedido…");
    await screen.findByRole("heading", { name: "Pedido confirmado" });
    expect(requests).toBe(1);
  });
});
