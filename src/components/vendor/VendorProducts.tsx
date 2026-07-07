"use client";

import { useMemo, useState } from "react";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import { toPersianDigits } from "@/lib/format";
import type { LandingProduct } from "@/lib/shop/landing";

/** Vendor product grid with category-chip filtering (chips from product `info`). */
export function VendorProducts({ products }: { products: LandingProduct[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.info && set.add(p.info));
    return Array.from(set);
  }, [products]);

  const [active, setActive] = useState<string | null>(null);
  const shown = active ? products.filter((p) => p.info === active) : products;

  if (!products.length) {
    return (
      <p className="py-16 text-center text-muted">
        این فروشنده هنوز محصولی ثبت نکرده است.
      </p>
    );
  }

  return (
    <div>
      {categories.length > 1 ? (
        <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
          <Chip label="همه" active={active === null} onClick={() => setActive(null)} />
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              active={active === c}
              onClick={() => setActive(c)}
            />
          ))}
        </div>
      ) : null}

      <div className="mb-3 text-sm text-muted tnum">
        {toPersianDigits(shown.length)} محصول
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => (
          <LandingProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-teal-600 bg-teal-600 text-surface"
          : "border-line bg-surface text-ink hover:border-teal-300"
      }`}
    >
      {label}
    </button>
  );
}
