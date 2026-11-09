import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { ApiError, ContractError, createOrder } from "@/services/client";

const pedido = {
  mesaId: 4,
  items: [
    { productId: "Espresso-5", quantity: 2 },
    { productId: "Pastry-19", quantity: 1 },
  ],
};

const pedidoCreado = {
  id: "Order-1",
  mesaId: 4,
  items: pedido.items,
  status: "pending",
  total: 17220,
};

describe("createOrder", () => {
  it("sends the table and the items in the body of POST /orders", async () => {
    let body: unknown;
    server.use(
      http.post("/api/orders", async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(pedidoCreado, { status: 201 });
      }),
    );

    await createOrder(pedido);

    expect(body).toEqual(pedido);
  });

  it("returns the order number, status and total from the api", async () => {
    server.use(http.post("/api/orders", () => HttpResponse.json(pedidoCreado, { status: 201 })));

    const order = await createOrder(pedido);

    expect(order).toEqual(pedidoCreado);
  });

  it("throws the api message when the order is rejected", async () => {
    server.use(
      http.post("/api/orders", () =>
        HttpResponse.json({ error: "Producto Pastry-19 no encontrado" }, { status: 404 }),
      ),
    );

    const error = await createOrder(pedido).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toHaveProperty("message", "Producto Pastry-19 no encontrado");
    expect(error).toHaveProperty("status", 404);
  });

  it("throws a contract error when the response does not match", async () => {
    server.use(http.post("/api/orders", () => HttpResponse.json({ numero: 1 }, { status: 201 })));

    await expect(createOrder(pedido)).rejects.toBeInstanceOf(ContractError);
  });
});
