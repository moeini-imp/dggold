"use client";

import { useCart } from "@/components/cart/CartProvider";
import { CartBadge } from "@/components/cart/CartBadge";
import { CartIcon } from "@/components/ui/icons";

/** Header cart icon — opens the shared cart modal (only when there's something in it). */
export function HeaderCartButton() {
  const { totalCount, openModal } = useCart();
  return (
    <button
      type="button"
      onClick={() => {
        if (totalCount > 0) openModal();
      }}
      aria-label="سبد خرید"
      className="relative grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-surface text-ink transition hover:bg-canvas"
    >
      <CartIcon className="h-5 w-5" />
      <CartBadge className="absolute -top-1.5 -left-1.5" />
    </button>
  );
}
