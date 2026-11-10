import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { ApiError, ContractError, getOrder } from "@/services/client";

const pedido = {
  id: "Order-1",
  mesaId: 4,
  items: [{ productId: 5, quantity: 2 }],
  status: "preparing",
  total: 14720,
};

describe("getOrder", () => {
  it("requests the order by id and returns it", async () => {
    let requestedId: string | undefined;
    server.use(
      http.get("/api/orders/:id", ({ params }) => {
        requestedId = String(params.id);
        return HttpResponse.json(pedido);
      }),
    );

    const order = await getOrder("Order-1");

    expect(requestedId).toBe("Order-1");
    expect(order).toEqual(pedido);
  });

  it("throws the api message when the order does not exist", async () => {
    server.use(
      http.get("/api/orders/:id", () =>
        HttpResponse.json({ error: "Orden Order-9 no encontrada" }, { status: 404 }),
      ),
    );

    const error = await getOrder("Order-9").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toHaveProperty("message", "Orden Order-9 no encontrada");
  });

  it("throws a contract error when the status is unknown", async () => {
    server.use(
      http.get("/api/orders/:id", () => HttpResponse.json({ ...pedido, status: "perdido" })),
    );

    await expect(getOrder("Order-1")).rejects.toBeInstanceOf(ContractError);
  });
});
