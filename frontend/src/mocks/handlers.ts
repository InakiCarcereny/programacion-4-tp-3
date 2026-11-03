import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("/api/products", () => {
    return HttpResponse.json([]);
  }),

  http.post("/api/orders", () => {
    return HttpResponse.json({ error: "no implementado en los mocks todavia" }, { status: 501 });
  }),
];
