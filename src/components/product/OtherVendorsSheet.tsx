"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { VendorOffer } from "@/lib/types";

/**
 * Multi-vendor price comparison ("فروشندگان دیگر"). Bottom sheet on mobile,
 * centered modal on desktop. Offers are pre-sorted ascending by price.
 */
export function OtherVendorsSheet({
  open,
  offers,
  selectedVendorId,
  onSelect,
  onClose,
}: {
  open: boolean;
  offers: VendorOffer[];
  selectedVendorId: string;
  onSelect: (vendorId: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const cheapest = offers[0]?.price;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md rounded-t-hero bg-surface p-5 shadow-pop md:rounded-hero">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">سایر فروشندگان</h2>
          <button
            type="button"
            aria-label="بستن"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-ink/60 hover:bg-canvas"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-3 text-sm text-muted">
          {toPersianDigits(offers.length)} فروشنده این محصول را عرضه می‌کنند
        </p>

        <ul className="max-h-[60vh] space-y-2 overflow-y-auto">
          {offers.map((o, i) => {
            const selected = o.vendorId === selectedVendorId;
            const isCheapest = o.price === cheapest;
            return (
              <li key={o.vendorId}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(o.vendorId);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-card border p-3 text-right transition ${
                    selected
                      ? "border-teal-600 bg-teal-50"
                      : "border-line bg-surface hover:border-teal-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas text-sm font-bold text-teal-700">
                      {toPersianDigits(i + 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">
                        {o.vendorName}
                      </p>
                      {isCheapest ? (
                        <span className="text-xs font-medium text-success">
                          کمترین قیمت
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="font-bold text-teal-700 tnum">
                      {formatToman(o.price)}
                    </p>
                    {o.originalPrice ? (
                      <p className="text-xs text-muted line-through tnum">
                        {formatToman(o.originalPrice, false)}
                      </p>
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
