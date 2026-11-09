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
  constructor() {
    super("La respuesta del menú no cumple el contrato de la API");
    this.name = "ContractError";
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
