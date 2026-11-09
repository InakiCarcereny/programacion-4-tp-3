import { HttpResponse, http } from "msw";
import { productsFixture } from "@/mocks/fixtures";

export const handlers = [
  http.get("/api/products", () => HttpResponse.json(productsFixture)),

  http.post("/api/orders", () =>
    HttpResponse.json({ error: "no implementado en los mocks todavia" }, { status: 501 }),
  ),
];
