"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/ui/ProductImage";
import { CartIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { LandingProduct } from "@/lib/shop/landing";

/**
 * Product card used everywhere a real product list renders (home page
 * backend-composed sections, discounts, category pages, vendor minisite,
 * PDP related products). Adds straight to cart and opens the cart modal,
 * same as the product detail page — which already keys its cart line on
 * `vendor?.id ?? 0`, since not every real product has a vendor assigned.
 * We follow that same established fallback here rather than only allowing
 * add-to-cart where a vendor happens to be present.
 */
export function LandingProductCard({ product }: { product: LandingProduct }) {
  const { add, openModal } = useCart();
  const href = product.slug
    ? `/Product/Detail/${product.id}/${encodeURIComponent(product.slug)}`
    : `/Product/Detail/${product.id}/-`;
  const hasDiscount =
    product.discountPercent > 0 && product.finalPrice < product.totalPrice;

  const handleAdd = () => {
    add(String(product.id), String(product.vendorId ?? 0), 1, {
      slug: product.slug,
      title: product.name,
      imageUrl: product.imageUrl,
      vendorName: product.vendorName ?? "دیجی گلد",
      unitPrice: product.finalPrice,
      originalUnitPrice: hasDiscount ? product.totalPrice : undefined,
      maxQuantity: 10,
    });
    openModal();
  };

  return (
    <article className="group relative flex h-full flex-col gap-3.5 rounded-card border border-line bg-surface p-5 shadow-card transition hover:shadow-pop">
      <Link href={href} className="flex flex-col gap-3.5">
        {hasDiscount ? (
          <span className="absolute left-3.5 top-3.5 z-10 rounded-lg bg-danger px-2 py-1 text-[11px] font-bold text-surface">
            {toPersianDigits(product.discountPercent)}٪
          </span>
        ) : null}
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full rounded-xl bg-canvas"
        />
        <div>
          <h3 className="line-clamp-2 min-h-[2.6em] text-sm font-bold leading-relaxed text-ink">
            {product.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {product.weight > 0 ? (
              <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[11px] text-gold-600">
                {toPersianDigits(product.weight)} گرم
              </span>
            ) : null}
            {product.info ? (
              <span className="rounded-md bg-canvas px-2 py-0.5 text-[11px] text-muted">
                {product.info}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="mt-auto flex items-end justify-between gap-2.5">
        <Link href={href} className="min-w-0 flex-1" aria-label={product.name}>
          {hasDiscount ? (
            <p className="truncate text-xs text-muted line-through tnum">
              {formatToman(product.totalPrice, false)}
            </p>
          ) : null}
          <p className="truncate text-lg font-extrabold text-ink tnum">
            {formatToman(product.finalPrice)}
          </p>
        </Link>

        <button
          type="button"
          aria-label="افزودن به سبد خرید"
          onClick={handleAdd}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-teal-600 text-gold-300 transition hover:bg-teal-700"
        >
          <CartIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </article>
  );
}
