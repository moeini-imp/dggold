"use client";

import { breakdownForOffer } from "@/lib/pricing";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { Product, VendorOffer } from "@/lib/types";

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-muted">{label}</span>
      <span
        className={`tnum text-left ${
          strong ? "text-lg font-extrabold text-ink" : "font-medium text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/** "توضیح کالا" — gold price breakdown for the selected vendor offer. */
export function PriceDetails({
  product,
  offer,
}: {
  product: Product;
  offer: VendorOffer;
}) {
  const b = breakdownForOffer(product, offer);

  return (
    <section className="rounded-card bg-surface p-4 shadow-card md:p-5">
      <h2 className="mb-1 text-base font-bold text-ink">توضیح کالا</h2>

      <div className="divide-y divide-line">
        {b.weightGram ? (
          <Row
            label="وزن"
            value={`${toPersianDigits(b.weightGram)} گرم`}
          />
        ) : null}
        <Row
          label="اجرت"
          value={`${formatToman(b.makingFee)} (${toPersianDigits(
            b.makingFeePercent,
          )}٪)`}
        />
        <Row
          label="مالیات"
          value={`${formatToman(b.tax)} (${toPersianDigits(b.taxPercent)}٪)`}
        />
        <Row label="قیمت خالص" value={formatToman(b.netPrice)} />
        <Row label="قیمت نهایی" value={formatToman(b.finalPrice)} strong />
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 rounded-card border border-line px-4 py-3">
        <span className="text-sm text-muted">فروشنده</span>
        <span className="font-bold text-ink">{offer.vendorName}</span>
      </div>
    </section>
  );
}
