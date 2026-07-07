import { shopPostJson } from "@/lib/shop/http";

export interface ShippingType {
  id: number;
  code: number;
  orderIndex: number;
  title: string;
  description: string;
  cost: number; // Toman
  durationTime: string;
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Active shipping methods, sorted by orderIndex. Returns null on failure. */
export async function getShippingTypes(): Promise<ShippingType[] | null> {
  const json = (await shopPostJson("/Order/GetShippingTypes", undefined, {
    attempts: 1,
  })) as { data?: unknown } | null;
  if (!Array.isArray(json?.data)) return null;
  return (json.data as Raw[])
    .filter((s) => s.enabled !== false && s.deleted !== true)
    .map((s) => ({
      id: num(s.id),
      code: num(s.code),
      orderIndex: num(s.orderIndex),
      title: String(s.title ?? ""),
      description: String(s.description ?? ""),
      cost: num(s.cost),
      durationTime: String(s.durationTime ?? ""),
    }))
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/** Fallback list (same shape) when the API is unreachable. */
export function buildMockShippingTypes(): ShippingType[] {
  return [
    {
      id: 10,
      code: 1,
      orderIndex: 1,
      title: "تحویل در محل فروشگاه (ساعت ۱۰:۰۰ تا ۱۶:۰۰) - با هماهنگی قبلی",
      description: "",
      cost: 0,
      durationTime: "",
    },
    {
      id: 11,
      code: 2,
      orderIndex: 2,
      title: "اکسپرس (فقط شهر تهران) - ارسال در ساعات اداری",
      description: "",
      cost: 260000,
      durationTime: "تحویل ۲ الی ۳ روز کاری",
    },
    {
      id: 12,
      code: 3,
      orderIndex: 3,
      title: "ارسال از طریق پست پیشتاز",
      description: "",
      cost: 260000,
      durationTime: "تحویل ۲ الی ۳ روز کاری",
    },
  ];
}
