export interface Producto {
  id: string;
  name: string;
  basePrice: number;
  finalPrice: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error.length > 0) {
      return body.error;
    }
  } catch {
    // sin cuerpo json: usamos el codigo de estado
  }
  return `Error ${response.status}`;
}

export async function getProductos(): Promise<Producto[]> {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as Producto[];
}
