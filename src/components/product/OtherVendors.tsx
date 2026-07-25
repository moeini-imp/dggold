"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { ProductDetail } from "@/lib/shop/product";

type Row = {
  key: string;
  isCurrent: boolean;
  productId: number;
  slug: string;
  name: string;
  logo: string;
  cashPrice: number;
  weight: number;
  inStock: boolean;
};

const INLINE_LIMIT = 3;

/**
 * "این کالا از فروشندگان دیگر" — multi-vendor comparison on the PDP. The current
 * vendor is shown in its true sorted position (highlighted, not tappable);
 * every other vendor links to its own product page. Renders nothing when the
 * product has no other vendors.
 */
export function OtherVendors({ detail }: { detail: ProductDetail }) {
  const [expanded, setExpanded] = useState(false);

  if (!detail.otherVendors.length) return null;

  const currentRow: Row = {
    key: "current",
    isCurrent: true,
    productId: detail.id,
    slug: detail.slug || "-",
    name: detail.vendor?.name || "دیجی گلد",
    logo: detail.vendor?.imageUrl || "",
    cashPrice: detail.cashPrice,
    weight: detail.weight,
    inStock: detail.countAvailable > 0,
  };

  const otherRows: Row[] = detail.otherVendors.map((v) => ({
    key: `v-${v.productId}`,
    isCurrent: false,
    productId: v.productId,
    slug: "-",
    name: v.vendorName || "فروشنده",
    logo: v.vendorLogoUrl,
    cashPrice: v.cashPrice,
    weight: v.weight,
    inStock: v.countAvailable > 0,
  }));

  // In-stock first, then by cash price ascending; out-of-stock sink to bottom.
  const rows = [currentRow, ...otherRows].sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    return a.cashPrice - b.cashPrice;
  });

  const cheapest = Math.min(
    ...rows.filter((r) => r.inStock).map((r) => r.cashPrice),
  );

  const visible = expanded ? rows : rows.slice(0, INLINE_LIMIT);
  const hiddenCount = rows.length - visible.length;

  return (
    <section
      id="other-vendors"
      className="scroll-mt-24 rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-xs"
    >
      <div className="mb-3.5 flex items-center justify-between border-b border-line pb-3">
        <h3 className="text-xs font-extrabold text-muted uppercase tracking-wider">
          این کالا از فروشندگان دیگر
        </h3>
        <span className="rounded-full bg-canvas px-2.5 py-0.5 text-[11px] font-bold text-ink tnum">
          {toPersianDigits(rows.length)} فروشنده
        </span>
      </div>

      <ul className="space-y-2.5">
        {visible.map((r) => (
          <li key={r.key}>
            <VendorRow
              row={r}
              isCheapest={r.inStock && r.cashPrice === cheapest}
              priceDelta={r.isCurrent ? 0 : r.cashPrice - currentRow.cashPrice}
              currentWeight={detail.weight}
            />
          </li>
        ))}
      </ul>

      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-line py-2.5 text-xs font-bold text-teal-700 transition hover:border-teal-300 hover:bg-teal-50/50"
        >
          مشاهده همه {toPersianDigits(rows.length)} فروشنده
        </button>
      ) : null}
    </section>
  );
}

function VendorRow({
  row,
  isCheapest,
  priceDelta,
  currentWeight,
}: {
  row: Row;
  isCheapest: boolean;
  priceDelta: number;
  currentWeight: number;
}) {
  const inner = (
    <>
      {/* Logo / initial */}
      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-canvas text-sm font-extrabold text-teal-700">
        {row.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.logo}
            alt={row.name}
            className="h-full w-full object-contain"
          />
        ) : (
          row.name.charAt(0) || "د"
        )}
      </span>

      {/* Name + metadata */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-sm font-bold text-ink">{row.name}</p>
          {row.isCurrent ? (
            <span className="rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-700">
              فروشنده فعلی
            </span>
          ) : isCheapest ? (
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
              ارزان‌ترین
            </span>
          ) : null}
        </div>

        {row.weight && row.weight !== currentWeight ? (
          <p className="mt-0.5 truncate text-[11px] text-muted tnum">
            {toPersianDigits(row.weight)} گرم
          </p>
        ) : null}

        {!row.inStock ? (
          <p className="mt-0.5 text-[11px] font-bold text-amber-700">ناموجود</p>
        ) : priceDelta < 0 ? (
          <p className="mt-0.5 text-[11px] font-bold text-emerald-600 tnum">
            {formatToman(Math.abs(priceDelta), false)} تومان ارزان‌تر
          </p>
        ) : priceDelta > 0 ? (
          <p className="mt-0.5 text-[11px] text-muted tnum">
            {formatToman(priceDelta, false)} تومان گران‌تر
          </p>
        ) : null}
      </div>

      {/* Price */}
      <div className="shrink-0 text-left">
        <p className="text-sm font-extrabold text-ink tnum">
          {formatToman(row.cashPrice, false)}
          <span className="ms-1 text-[10px] font-normal text-muted">تومان</span>
        </p>
      </div>

      {/* Forward chevron (RTL: points to the next page) — links only */}
      {!row.isCurrent && row.inStock ? (
        <ChevronLeft className="h-4 w-4 shrink-0 text-muted" />
      ) : (
        <span className="w-4 shrink-0" />
      )}
    </>
  );

  const base =
    "flex items-center gap-3 rounded-card border p-3 text-right transition";

  // Current vendor and out-of-stock offers are not tappable.
  if (row.isCurrent) {
    return (
      <div className={`${base} border-teal-200 bg-teal-50/60`}>{inner}</div>
    );
  }
  if (!row.inStock) {
    return (
      <div className={`${base} border-line bg-canvas/50 opacity-60`}>
        {inner}
      </div>
    );
  }
  return (
    <Link
      href={`/Product/Detail/${row.productId}/${encodeURIComponent(row.slug)}`}
      scroll
      className={`${base} border-line bg-surface hover:border-teal-300 hover:bg-teal-50/40 active:bg-teal-50`}
    >
      {inner}
    </Link>
  );
}
