import { orderSchema, type NewOrder, type Order } from "@/schemas/orders";
import { productsSchema, type Product } from "@/schemas/products";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ContractError extends Error {
  constructor(message = "La respuesta del menú no cumple el contrato de la API") {
    super(message);
    this.name = "ContractError";
  }
}

export class NetworkError extends Error {
  constructor() {
    super("No pudimos conectar con la cafetería. Revisá tu conexión e intentá de nuevo.");
    this.name = "NetworkError";
  }
}

async function send(input: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    throw new NetworkError();
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error.length > 0) {
      return body.error;
    }
  } catch {
    //
  }
  return `Error ${response.status}`;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  const data: unknown = await response.json();
  const parsed = productsSchema.safeParse(data);

  if (!parsed.success) {
    throw new ContractError();
  }

  return parsed.data;
}

const ORDER_CONTRACT_MESSAGE = "La respuesta del pedido no cumple el contrato de la API";

async function readOrder(response: Response): Promise<Order> {
  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  const data: unknown = await response.json();
  const parsed = orderSchema.safeParse(data);

  if (!parsed.success) {
    throw new ContractError(ORDER_CONTRACT_MESSAGE);
  }

  return parsed.data;
}

export async function createOrder(order: NewOrder): Promise<Order> {
  const response = await send("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  return readOrder(response);
}

export async function getOrder(id: string): Promise<Order> {
  const response = await send(`/api/orders/${encodeURIComponent(id)}`);

  return readOrder(response);
}
