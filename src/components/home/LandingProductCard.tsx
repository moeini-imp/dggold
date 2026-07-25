"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/ui/ProductImage";
import { CartIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { LandingProduct } from "@/lib/shop/landing";

export function LandingProductCard({ product }: { product: LandingProduct }) {
  const { add, openModal } = useCart();
  const href = product.slug
    ? `/Product/Detail/${product.id}/${encodeURIComponent(product.slug)}`
    : `/Product/Detail/${product.id}/-`;
  const hasDiscount =
    product.discountPercent > 0 && product.finalPrice < product.totalPrice;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(String(product.id), String(product.vendorId ?? 0), 1, {
      slug: product.slug,
      title: product.name,
      imageUrl: product.imageUrl,
      vendorName: product.vendorName ?? "دیجی گلد",
      unitPrice: product.finalPrice,
      creditUnitPrice: product.creditPrice || undefined,
      originalUnitPrice: hasDiscount ? product.totalPrice : undefined,
      maxQuantity: 10,
    });
    openModal();
  };

  return (
    <article className="group relative flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-card sm:p-4">
      <div>
        <Link href={href} className="block space-y-3">
          {/* Top Badges */}
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-canvas">
            {hasDiscount ? (
              <span className="absolute start-2.5 top-2.5 z-10 rounded-lg bg-danger px-2 py-0.5 text-[10px] font-bold text-surface shadow-xs">
                {toPersianDigits(product.discountPercent)}٪ تخفیف
              </span>
            ) : null}

            {product.weight > 0 ? (
              <span className="absolute end-2.5 top-2.5 z-10 rounded-lg bg-teal-950/80 text-gold-300 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold shadow-xs">
                {toPersianDigits(product.weight)} گرم
              </span>
            ) : null}

            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            />
          </div>

          {/* Title & Seller */}
          <div className="space-y-1">
            {product.vendorName ? (
              <p className="text-[10px] font-semibold text-muted truncate">
                {product.vendorName}
              </p>
            ) : null}
            <h3 className="line-clamp-2 min-h-[2.5em] text-xs font-bold leading-relaxed text-ink group-hover:text-teal-700 transition">
              {product.name}
            </h3>
          </div>
        </Link>
      </div>

      {/* Pricing & Cart Action */}
      <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between gap-2">
        <Link href={href} className="min-w-0 flex-1">
          {hasDiscount ? (
            <p className="truncate text-[10px] text-muted line-through tnum">
              {formatToman(product.totalPrice, false)}
            </p>
          ) : null}
          <p className="text-xs font-extrabold text-teal-700 sm:text-sm tnum">
            {formatToman(product.finalPrice, false)}
            <span className="text-[10px] font-normal text-muted ms-1 hidden sm:inline">تومان</span>
          </p>
        </Link>

        <button
          type="button"
          aria-label="افزودن به سبد خرید"
          onClick={handleAdd}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-600 text-gold-300 transition hover:bg-teal-700 active:scale-95 shadow-xs"
        >
          <CartIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
