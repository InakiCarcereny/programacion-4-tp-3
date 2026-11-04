import { useCallback, useEffect, useState } from "react";
import { getProductos, type Producto } from "@/services/client";

export type MenuState =
  | { status: "cargando" }
  | { status: "error"; message: string }
  | { status: "listo"; productos: Producto[] };

export interface UseMenuResult {
  state: MenuState;
  retry: () => void;
}

export function useMenu(): UseMenuResult {
  const [state, setState] = useState<MenuState>({ status: "cargando" });

  const load = useCallback(async (): Promise<void> => {
    setState({ status: "cargando" });

    try {
      const productos = await getProductos();
      setState({ status: "listo", productos });
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
