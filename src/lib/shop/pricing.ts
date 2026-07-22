/**
 * Psychological offer display. The cash price never changes — but we present
 * it as if discounted from an inflated "original" (cashPrice + ratio%), so the
 * card/PDP show a struck price + a discount badge.
 */
export function psychologicalOffer(
  cashPrice: number,
  ratio: number,
): { finalPrice: number; originalPrice: number; discountPercent: number } {
  if (!(ratio > 0) || !(cashPrice > 0)) {
    return { finalPrice: cashPrice, originalPrice: 0, discountPercent: 0 };
  }
  const originalPrice = Math.round(cashPrice * (1 + ratio / 100));
  const discountPercent = Math.round(
    ((originalPrice - cashPrice) / originalPrice) * 100,
  );
  return { finalPrice: cashPrice, originalPrice, discountPercent };
}
