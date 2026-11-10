import { useCallback, useEffect, useState } from "react";
import { getProducts } from "@/services/client";
import type { Product } from "@/schemas/products";

export type MenuState =
  | { status: "cargando" }
  | { status: "error"; message: string }
  | { status: "listo"; products: Product[] };

export interface UseMenuResult {
  state: MenuState;
  retry: () => void;
}

export function useMenu(): UseMenuResult {
  const [state, setState] = useState<MenuState>({ status: "cargando" });

  const load = useCallback(async (): Promise<void> => {
    setState({ status: "cargando" });

    try {
      const products = await getProducts();
      setState({ status: "listo", products });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "No pudimos cargar el menu",
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { state, retry: load };
}
