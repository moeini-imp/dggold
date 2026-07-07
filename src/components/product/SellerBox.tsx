"use client";

import { ChevronLeft } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { VendorOffer } from "@/lib/types";

/**
 * Compact "سایر فروشندگان" box shown in the empty space below the gallery on
 * desktop. Lists the other vendor offers (excluding the selected one) so the
 * shopper can switch sellers without opening the full compare sheet.
 */
export function SellerBox({
  offers,
  selectedVendorId,
  onSelect,
  onSeeAll,
  className = "",
}: {
  offers: VendorOffer[];
  selectedVendorId: string;
  onSelect: (vendorId: string) => void;
  onSeeAll: () => void;
  className?: string;
}) {
  const others = offers.filter((o) => o.vendorId !== selectedVendorId);
  if (!others.length) return null;

  const shown = others.slice(0, 3);

  return (
    <section
      className={`rounded-card bg-surface p-4 shadow-card md:p-5 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">سایر فروشندگان</h2>
        <span className="text-xs text-muted">
          {toPersianDigits(others.length)} فروشنده دیگر
        </span>
      </div>

      <ul className="space-y-2">
        {shown.map((o) => (
          <li key={o.vendorId}>
            <button
              type="button"
              onClick={() => onSelect(o.vendorId)}
              className="flex w-full items-center justify-between gap-3 rounded-card border border-line p-3 text-right transition hover:border-teal-300"
            >
              <span className="truncate font-medium text-ink">
                {o.vendorName}
              </span>
              <span className="shrink-0 text-left">
                <span className="block font-bold text-teal-700 tnum">
                  {formatToman(o.price)}
                </span>
                {o.originalPrice ? (
                  <span className="block text-xs text-muted line-through tnum">
                    {formatToman(o.originalPrice, false)}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {others.length > shown.length ? (
        <button
          type="button"
          onClick={onSeeAll}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-btn bg-canvas py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
        >
          فروشندگان دیگر
          <ChevronLeft className="h-4 w-4" />
        </button>
      ) : null}
    </section>
  );
}
