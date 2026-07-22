import { toPersianDigits } from "@/lib/format";

/**
 * Granule (گرانول) = small beads/droplets of pure gold or silver held in the
 * wallet. Sold by weight in سوت (1 گرم = ۱۰۰۰ سوت).
 */
// کارمزد خرید — depends on the gateway: به‌پرداخت ملت is cheaper.
export const GRANULE_FEE_RATE_DEFAULT = 0.085; // ۸٫۵٪
export const GRANULE_FEE_RATE_MELLAT = 0.03; // ۳٪ for به‌پرداخت ملت

/** Buy fee rate for the chosen gateway (by its display name). */
export function granuleFeeRate(gatewayName?: string): number {
  if (gatewayName && /ملت|mellat|behpardakht/i.test(gatewayName)) {
    return GRANULE_FEE_RATE_MELLAT;
  }
  return GRANULE_FEE_RATE_DEFAULT;
}

export const MIN_GRANULE_SOOT = 500; // minimum purchase: ۵۰۰ سوت (نیم گرم)

/** How many سوت of granule a Toman amount buys at the given per-gram price. */
export function sootForToman(amountToman: number, pricePerGram: number): number {
  if (pricePerGram <= 0) return 0;
  return Math.round((amountToman / pricePerGram) * 1000);
}

/** Toman cost of `soot` سوت of granule at the given per-gram price (before اجرت). */
export function tomanForSoot(soot: number, pricePerGram: number): number {
  return Math.round((soot / 1000) * pricePerGram);
}

/** Grams at which the bottle reads visually full. */
const BOTTLE_FULL_GRAMS = 10;

/** Bottle fill 0..1 — monotonic (more grams always = more fill). A √ curve so
 *  small amounts are still clearly visible; full at ~۱۰ گرم. */
export function bottleFraction(grams: number): number {
  if (grams <= 0) return 0;
  return Math.min(1, Math.sqrt(grams / BOTTLE_FULL_GRAMS));
}

/** Display سوت nicely — grams once it's ≥ ۱ گرم, otherwise سوت. */
export function formatGranule(soot: number): string {
  if (soot <= 0) return "۰ سوت";
  if (soot >= 1000) {
    const grams = parseFloat((soot / 1000).toFixed(3));
    return `${toPersianDigits(grams)} گرم`;
  }
  return `${toPersianDigits(soot)} سوت`;
}
