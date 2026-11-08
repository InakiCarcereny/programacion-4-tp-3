import { useCallback, useState } from "react";
import type { Order } from "@/schemas/orders";
import { getOrder } from "@/services/client";

export interface UseOrderTrackingResult {
  order: Order;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useOrderTracking(initialOrder: Order): UseOrderTrackingResult {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);

    try {
      setOrder(await getOrder(order.id));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos consultar el pedido");
    } finally {
      setRefreshing(false);
    }
  }, [order.id]);

  return { order, refreshing, error, refresh };
}
