import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { Checkout } from "@/components/Checkout";
import { CartProvider } from "@/context/CartContext";
import { server } from "@/mocks/server";
import type { CartState } from "@/types/cart";

const cart: CartState = {
  items: [{ product: { id: 5, name: "Expreso Mediano Colombia", price: 7360 }, quantity: 2 }],
};

const pedido = {
  id: "Order-1",
  mesaId: 4,
  items: [{ productId: "5", quantity: 2 }],
  status: "pending",
  total: 14720,
};

async function confirmOrder(): Promise<ReturnType<typeof userEvent.setup>> {
  const user = userEvent.setup();
  server.use(http.post("/api/orders", () => HttpResponse.json(pedido, { status: 201 })));

  render(
    <CartProvider initialState={cart}>
      <Checkout mesa={4} />
    </CartProvider>,
  );

  await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));
  await screen.findByRole("heading", { name: "Pedido confirmado" });

  return user;
}

describe("track order", () => {
  it("updates the status with GET /orders/:id without reloading the page", async () => {
    let requestedId: string | undefined;
    server.use(
      http.get("/api/orders/:id", ({ params }) => {
        requestedId = String(params.id);
        return HttpResponse.json({ ...pedido, status: "preparing" });
      }),
    );
    const user = await confirmOrder();

    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Actualizar estado" }));

    expect(await screen.findByText("En preparación")).toBeInTheDocument();
    expect(requestedId).toBe("Order-1");
    expect(screen.getByRole("heading", { name: "Pedido confirmado" })).toBeInTheDocument();
  });

  it("keeps the last known status and shows the api message when tracking fails", async () => {
    server.use(
      http.get("/api/orders/:id", () =>
        HttpResponse.json({ error: "Error interno de servidor" }, { status: 500 }),
      ),
    );
    const user = await confirmOrder();

    await user.click(screen.getByRole("button", { name: "Actualizar estado" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Error interno de servidor");
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("clears the tracking error after a successful update", async () => {
    server.use(
      http.get(
        "/api/orders/:id",
        () => HttpResponse.json({ error: "Error interno de servidor" }, { status: 500 }),
        { once: true },
      ),
      http.get("/api/orders/:id", () => HttpResponse.json({ ...pedido, status: "delivered" })),
    );
    const user = await confirmOrder();

    await user.click(screen.getByRole("button", { name: "Actualizar estado" }));
    await screen.findByRole("alert");
    await user.click(screen.getByRole("button", { name: "Actualizar estado" }));

    expect(await screen.findByText("Entregado")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
