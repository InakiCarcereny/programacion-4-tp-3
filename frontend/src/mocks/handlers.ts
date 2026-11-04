import { HttpResponse, http } from "msw";
import { productosFixture } from "@/mocks/fixtures";

export const handlers = [
  http.get("/api/products", () => HttpResponse.json(productosFixture)),

  http.post("/api/orders", () =>
    HttpResponse.json({ error: "no implementado en los mocks todavia" }, { status: 501 }),
  ),
];
