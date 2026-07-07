import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { CartIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { LandingProduct } from "@/lib/shop/landing";

export function LandingProductCard({ product }: { product: LandingProduct }) {
  const href = product.slug
    ? `/Product/Detail/${product.id}/${encodeURIComponent(product.slug)}`
    : `/Product/Detail/${product.id}/-`;
  const hasDiscount = product.discountPercent > 0 && product.finalPrice < product.totalPrice;

  return (
    <article className="group relative flex h-full flex-col rounded-card bg-surface p-3 shadow-card transition hover:shadow-pop">
      {hasDiscount ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-teal-600 px-2 py-0.5 text-xs font-bold text-surface tnum">
          {toPersianDigits(product.discountPercent)}٪-
        </span>
      ) : null}

      <Link href={href} className="flex flex-col">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full rounded-xl bg-canvas"
        />
        <h3 className="mt-3 line-clamp-2 min-h-[2.8em] text-sm font-medium leading-relaxed text-ink">
          {product.name}
        </h3>
        {product.info ? (
          <p className="mt-0.5 text-xs text-muted">{product.info}</p>
        ) : null}
      </Link>

      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
        <Link href={href} className="min-w-0 flex-1" aria-label={product.name}>
          {hasDiscount ? (
            <p className="truncate text-xs text-muted line-through tnum">
              {formatToman(product.totalPrice, false)}
            </p>
          ) : null}
          <p className="text-sm font-bold text-teal-700 tnum md:text-base">
            {formatToman(product.finalPrice)}
          </p>
        </Link>
        <Link
          href={href}
          aria-label="مشاهده محصول"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-btn bg-teal-600 text-surface transition hover:bg-teal-700"
        >
          <CartIcon className="h-5 w-5" />
        </Link>
      </div>
    </article>
  );
}
