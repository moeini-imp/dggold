import type { PriceBreakdown, Product, VendorOffer } from "@/lib/types";

/**
 * Decompose a final gold price into its parts:
 *   final = net + اجرت + مالیات
 *   اجرت  = net × feePct
 *   مالیات = اجرت × taxPct
 * so final = net × (1 + feePct × (1 + taxPct)).
 *
 * We back-solve `net` from the offer's final price, then recompute the parts
 * so the displayed rows always sum to the shown total exactly.
 */
export function computeBreakdown(
  finalPrice: number,
  opts: {
    weightGram?: number;
    makingFeePercent?: number;
    taxPercent?: number;
  } = {},
): PriceBreakdown {
  const makingFeePercent = opts.makingFeePercent ?? 7;
  const taxPercent = opts.taxPercent ?? 10;
  const fee = makingFeePercent / 100;
  const tax = taxPercent / 100;

  const factor = 1 + fee * (1 + tax);
  const netPrice = Math.round(finalPrice / factor);
  const makingFee = Math.round(netPrice * fee);
  const taxAmount = Math.round(makingFee * tax);

  return {
    weightGram: opts.weightGram,
    netPrice,
    makingFeePercent,
    makingFee,
    taxPercent,
    tax: taxAmount,
    finalPrice: netPrice + makingFee + taxAmount,
  };
}

/** Convenience: breakdown for a given product + chosen vendor offer. */
export function breakdownForOffer(
  product: Product,
  offer: VendorOffer,
): PriceBreakdown {
  return computeBreakdown(offer.price, {
    weightGram: product.weightGram,
    makingFeePercent: product.makingFeePercent,
    taxPercent: product.taxPercent,
  });
}
