"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { formatToman } from "@/lib/format";
import type { CartDisplayLine } from "@/lib/types";

export function CartLineItem({
  line,
  onSetQty,
  onRemove,
}: {
  line: CartDisplayLine;
  onSetQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const href = line.slug
    ? `/Product/Detail/${line.productId}/${encodeURIComponent(line.slug)}`
    : "#";
  return (
    <div className="flex gap-3 rounded-card bg-surface p-3 shadow-card">
      {/* image + stepper stacked */}
      <div className="flex w-24 shrink-0 flex-col gap-2">
        <Link href={href}>
          <ProductImage
            src={line.imageUrl}
            alt={line.title}
            className="aspect-square w-full rounded-xl bg-canvas"
          />
        </Link>
        <QtyStepper
          size="sm"
          fullWidth
          value={line.quantity}
          atMax={line.quantity >= line.maxQuantity}
          onIncrement={() =>
            onSetQty(Math.min(line.quantity + 1, line.maxQuantity))
          }
          onDecrement={() => onSetQty(line.quantity - 1)}
          onRemove={onRemove}
        />
      </div>

      {/* details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={href}
          className="line-clamp-2 text-sm font-medium leading-relaxed text-ink transition hover:text-teal-700"
        >
          {line.title}
        </Link>
        <p className="mt-0.5 text-xs text-muted">فروشنده: {line.vendorName}</p>

        <div className="mt-auto pt-2">
          {line.originalUnitPrice && line.originalUnitPrice > line.unitPrice ? (
            <p className="text-xs text-muted line-through tnum">
              {formatToman(line.originalUnitPrice * line.quantity, false)}
            </p>
          ) : null}
          <p className="text-base font-bold text-teal-700 tnum">
            {formatToman(line.lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
