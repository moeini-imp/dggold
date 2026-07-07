"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { CartIcon } from "@/components/ui/icons";
import { formatToman } from "@/lib/format";
import type { Product, VendorOffer } from "@/lib/types";

/**
 * Morphing buy bar stuck to the bottom of the page on all breakpoints:
 * shows price + "افزودن به سبد خرید" until the item is in the cart, then swaps
 * the button for a quantity stepper. On mobile it sits above the bottom tab
 * bar; on desktop (no tab bar) it sits flush at the bottom.
 */
export function ProductActionBar({
  product,
  offer,
}: {
  product: Product;
  offer: VendorOffer;
}) {
  const { getQuantity, add, setQty, remove } = useCart();
  const qty = getQuantity(product.id, offer.vendorId);
  const max = offer.maxQuantity ?? 10;

  return (
    <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface md:bottom-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 md:gap-4 md:px-6">
        <div className="min-w-0 shrink-0">
          {offer.originalPrice && offer.originalPrice > offer.price ? (
            <p className="text-xs text-muted line-through tnum">
              {formatToman(offer.originalPrice, false)}
            </p>
          ) : null}
          <p className="text-base font-extrabold text-teal-700 tnum md:text-lg">
            {formatToman(offer.price)}
          </p>
        </div>

        {qty > 0 ? (
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <div className="whitespace-nowrap text-left leading-tight">
              <p className="hidden text-xs text-muted sm:block">در سبد شما</p>
              <Link
                href="/cart"
                className="whitespace-nowrap text-xs font-medium text-teal-700 hover:underline md:text-sm"
              >
                مشاهده سبد خرید
              </Link>
            </div>
            <QtyStepper
              size="sm"
              value={qty}
              atMax={qty >= max}
              onIncrement={() =>
                setQty(product.id, offer.vendorId, Math.min(qty + 1, max))
              }
              onDecrement={() => setQty(product.id, offer.vendorId, qty - 1)}
              onRemove={() => remove(product.id, offer.vendorId)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => add(product.id, offer.vendorId)}
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-teal-600 px-4 py-2.5 text-sm font-bold text-surface transition hover:bg-teal-700 md:max-w-xs md:px-6"
          >
            <CartIcon className="h-4 w-4 shrink-0" />
            افزودن به سبد خرید
          </button>
        )}
      </div>
    </div>
  );
}
