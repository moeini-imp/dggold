import { shopPostJson } from "@/lib/shop/http";

export interface PaymentGateway {
  id: number;
  code: number;
  orderIndex: number;
  name: string;
  description: string;
  key: string;
  isActive: boolean;
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Active payment gateways, sorted by orderIndex. Returns null on failure. */
export async function getPaymentGateways(): Promise<PaymentGateway[] | null> {
  const json = (await shopPostJson("/Order/GetPaymentGateways", undefined, {
    attempts: 1,
  })) as { data?: unknown } | null;
  if (!Array.isArray(json?.data)) return null;
  return (json.data as Raw[])
    .map((g) => ({
      id: num(g.id),
      code: num(g.code),
      orderIndex: num(g.orderIndex),
      name: String(g.name ?? ""),
      description: String(g.description ?? ""),
      key: String(g.key ?? ""),
      isActive: g.isActive !== false,
    }))
    .filter((g) => g.isActive)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/** Fallback list (same shape) when the API is unreachable. */
export function buildMockGateways(): PaymentGateway[] {
  return [
    { id: 1, code: 14, orderIndex: 1, name: "درگاه پرداخت تارا", description: "پرداخت اعتباری و اقساطی تارا", key: "tara", isActive: true },
    { id: 2, code: 2, orderIndex: 2, name: "پرداخت امن اسمارتیز", description: "پرداخت با کارت‌های عضو شتاب", key: "smartiz", isActive: true },
    { id: 5, code: 5, orderIndex: 5, name: "درگاه هوشمند دیجی‌پی", description: "پرداخت اعتباری و اقساطی دیجی‌پی", key: "digipay", isActive: true },
  ];
}
