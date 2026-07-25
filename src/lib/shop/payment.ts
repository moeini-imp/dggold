import { shopPostJson } from "@/lib/shop/http";

export interface PaymentGateway {
  id: number;
  code: number;
  orderIndex: number;
  name: string;
  description: string;
  key: string;
  isActive: boolean;
  /** Credit/installment gateway → order priced with creditPrice, not cashPrice. */
  isCredit: boolean;
  /** Gateway logo, when the backend provides one. Empty when absent. */
  imageUrl: string;
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
      isCredit: g.isCredit === true,
      imageUrl: String(g.imageUrl ?? ""),
    }))
    .filter((g) => g.isActive)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/** Fallback list (10+ partners) when the API is unreachable. */
export function buildMockGateways(): PaymentGateway[] {
  return [
    { id: 1, code: 14, orderIndex: 1, name: "اعتبار بالون", description: "خرید اقساطی طلا بدون ضامن", key: "baloan", isActive: true, isCredit: true, imageUrl: "" },
    { id: 2, code: 15, orderIndex: 2, name: "سامانه تارا", description: "اعتبار خرد و کیف پول تارا", key: "tara", isActive: true, isCredit: true, imageUrl: "" },
    { id: 3, code: 5, orderIndex: 3, name: "دیجی‌پی", description: "پرداخت اعتباری و اقساطی دیجی‌پی", key: "digipay", isActive: true, isCredit: true, imageUrl: "" },
    { id: 4, code: 16, orderIndex: 4, name: "ازکی‌وام", description: "تسهیلات خرید اقساطی آنلاین", key: "azkivam", isActive: true, isCredit: true, imageUrl: "" },
    { id: 5, code: 17, orderIndex: 5, name: "کیپاد پاسارگاد", description: "کیف پول و خرید اعتباری کیپاد", key: "qpod", isActive: true, isCredit: true, imageUrl: "" },
    { id: 6, code: 18, orderIndex: 6, name: "لندو", description: "وام و اعتبار خرید کالا و طلا", key: "lendo", isActive: true, isCredit: true, imageUrl: "" },
    { id: 7, code: 19, orderIndex: 7, name: "پایا اعتباری", description: "درگاه اقساطی پایا", key: "paya", isActive: true, isCredit: true, imageUrl: "" },
    { id: 8, code: 20, orderIndex: 8, name: "فرابوم", description: "زیرساخت پرداخت و کیف اعتباری", key: "faraboom", isActive: true, isCredit: true, imageUrl: "" },
    { id: 9, code: 21, orderIndex: 9, name: "مانلی اعتباری", description: "سازمان‌ها و خریدهای اقساطی", key: "maneli", isActive: true, isCredit: true, imageUrl: "" },
    { id: 10, code: 22, orderIndex: 10, name: "اعتبار خرد بانک", description: "درگاه اعتباری بانک‌های همکار", key: "bank_credit", isActive: true, isCredit: true, imageUrl: "" },
  ];
}
