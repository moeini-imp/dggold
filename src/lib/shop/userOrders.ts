/** User order history / tracking (via our proxies, bearer forwarded). */

export interface UserOrderProduct {
  name: string;
  info: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface UserOrder {
  id: string;
  statusId: number;
  statusName: string;
  trackCode: string;
  deliveryCode: number;
  totalPrice: number;
  addressTitle: string;
  address: string;
  products: UserOrderProduct[];
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normOrder(o: Raw): UserOrder {
  const addr = (o.address ?? {}) as Raw;
  const products = Array.isArray(o.product) ? (o.product as Raw[]) : [];
  return {
    id: String(o.id ?? ""),
    statusId: num(o.statusId),
    statusName: String(o.statusName ?? ""),
    trackCode: String(o.trackCode ?? ""),
    deliveryCode: num(o.deliveryCode),
    totalPrice: num(o.totalPrice),
    addressTitle: String(addr.title ?? ""),
    address: String(addr.address ?? ""),
    products: products.map((p) => ({
      name: String(p.name ?? ""),
      info: String(p.info ?? ""),
      quantity: num(p.quantity) || 1,
      price: num(p.price),
      imageUrl: String(p.imagesUrl ?? ""),
    })),
  };
}

/** The user's order history, newest first as returned by the API. */
export async function getOrderHistory(token: string): Promise<UserOrder[]> {
  const res = await fetch("/api/orders/history", {
    headers: { Authorization: `bearer ${token}` },
  });
  const json = (await res.json()) as { success?: boolean; data?: unknown };
  if (!json?.success || !Array.isArray(json.data)) {
    throw new Error("history-failed");
  }
  return (json.data as Raw[]).map(normOrder);
}

/** Track a single order by its id. */
export async function trackOrder(
  token: string,
  orderId: string,
): Promise<UserOrder> {
  const res = await fetch(
    `/api/orders/track?orderId=${encodeURIComponent(orderId)}`,
    { headers: { Authorization: `bearer ${token}` } },
  );
  const json = (await res.json()) as { success?: boolean; data?: unknown };
  if (!json?.success || !json.data) throw new Error("track-failed");
  return normOrder(json.data as Raw);
}
