import { shopGetJson } from "@/lib/shop/http";

/** Live spot price for one asset symbol (gold karat, coin, silver, ...). */
export interface AssetPrice {
  symbol: number;
  title: string;
  price: number; // Toman
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Live asset prices (گرم طلای ۱۸/۲۴ عیار، طلای آب‌شده، سکه‌ها، نقره...). Returns null on failure. */
export async function getLastAssetPrices(): Promise<AssetPrice[] | null> {
  const json = (await shopGetJson("/LandingPage/GetLastAssetPrice")) as {
    data?: unknown;
  } | null;
  if (!Array.isArray(json?.data)) return null;
  return (json.data as Raw[]).map((p) => ({
    symbol: num(p.symbol),
    title: String(p.title ?? ""),
    price: num(p.price),
  }));
}

/** Fallback so the live price bar still renders (same shape) if the API is unreachable. */
export function buildMockAssetPrices(): AssetPrice[] {
  return [
    { symbol: 3, title: "طلای آب‌شده", price: 18833000 },
    { symbol: 8, title: "نقره", price: 373562 },
    { symbol: 5, title: "سکه امامی", price: 189010000 },
  ];
}
