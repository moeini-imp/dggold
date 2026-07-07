"use client";

import { useCart } from "@/components/cart/CartProvider";
import { toPersianDigits } from "@/lib/format";

/** Live cart count bubble. Renders nothing when empty. */
export function CartBadge({ className = "" }: { className?: string }) {
  const { totalCount } = useCart();
  if (!totalCount) return null;
  return (
    <span
      className={`grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink tnum ${className}`}
    >
      {toPersianDigits(totalCount)}
    </span>
  );
}
