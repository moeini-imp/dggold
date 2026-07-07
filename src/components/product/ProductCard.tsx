import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { CartIcon } from "@/components/ui/icons";
import { discountPercent, formatToman, toPersianDigits } from "@/lib/format";
import type { ProductListItem } from "@/lib/types";

export function ProductCard({ product }: { product: ProductListItem }) {
  const discount = product.originalPrice
    ? discountPercent(product.originalPrice, product.price)
    : 0;

  return (
    <article className="group relative flex h-full flex-col rounded-card bg-surface p-3 shadow-card transition hover:shadow-pop">
      {discount > 0 ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-teal-600 px-2 py-0.5 text-xs font-bold text-surface tnum">
          {toPersianDigits(discount)}٪-
        </span>
      ) : null}

      <Link href={`/product/${product.slug}`} className="flex flex-col">
        <ProductImage
          src={product.imageUrl}
          alt={product.title}
          className="aspect-square w-full rounded-xl bg-canvas"
        />
        <h3 className="mt-3 line-clamp-2 min-h-[2.8em] text-sm font-medium leading-relaxed text-ink">
          {product.title}
        </h3>
      </Link>

      {/* footer: price block + add button on one row */}
      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
        <Link
          href={`/product/${product.slug}`}
          className="min-w-0 flex-1"
          aria-label={product.title}
        >
          {product.offerCount > 1 ? (
            <p className="mb-1 text-xs text-muted">
              {toPersianDigits(product.offerCount)} فروشنده
            </p>
          ) : null}
          {product.originalPrice ? (
            <p className="truncate text-xs text-muted line-through tnum">
              {formatToman(product.originalPrice, false)}
            </p>
          ) : null}
          <p className="text-sm font-bold text-teal-700 tnum md:text-base">
            {formatToman(product.price)}
          </p>
        </Link>

        <button
          type="button"
          aria-label="افزودن به سبد خرید"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-btn bg-teal-600 text-surface transition hover:bg-teal-700"
        >
          <CartIcon className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
