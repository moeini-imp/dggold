"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { ProductGallery } from "@/components/product/ProductGallery";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { ChevronLeft, CartIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { CartLineMeta } from "@/lib/types";
import type { ProductDetail, Money } from "@/lib/shop/product";

export function ProductDetailReal({ detail }: { detail: ProductDetail }) {
  const { getQuantity, add, setQty, remove } = useCart();

  const productId = String(detail.id);
  const vendorId = String(detail.vendor?.id ?? 0);
  const max = detail.countAvailable || 10;
  const qty = getQuantity(productId, vendorId);

  const hasDiscount = detail.discount.percent > 0 && detail.discount.rawValue > 0;
  const finalPrice = detail.totalPrice;
  const originalPrice = hasDiscount
    ? detail.totalPrice + detail.discount.rawValue
    : undefined;

  const meta: CartLineMeta = {
    slug: detail.slug,
    title: detail.name,
    imageUrl: detail.imagesUrl[0] ?? "",
    vendorName: detail.vendor?.name ?? "",
    unitPrice: finalPrice,
    originalUnitPrice: originalPrice,
    maxQuantity: max,
  };

  const images = detail.imagesUrl.length ? detail.imagesUrl : ["placeholder:gold"];

  const specsBlock = detail.dynamicProperties.length ? (
    <section className="rounded-card bg-surface p-4 shadow-card md:p-5">
      <h2 className="mb-2 font-bold text-ink">مشخصات</h2>
      <div className="divide-y divide-line">
        {detail.dynamicProperties.map((p) => (
          <div
            key={p.title}
            className="flex items-center justify-between py-2.5 text-sm"
          >
            <span className="text-muted">{p.title}</span>
            <span className="font-medium text-ink">{p.value}</span>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const descBlock = detail.description ? (
    <section className="rounded-card bg-surface p-4 shadow-card">
      <h2 className="mb-2 font-bold text-ink">توضیحات محصول</h2>
      <p className="text-sm leading-loose text-ink/80">{detail.description}</p>
    </section>
  ) : null;

  // Fill the space under the gallery on desktop; in-flow on mobile.
  const hasFillers = !!(specsBlock || descBlock);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 pb-44 md:px-6 md:py-8 md:pb-28">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition hover:text-teal-700"
      >
        بازگشت به فروشگاه
        <ChevronLeft className="h-4 w-4" />
      </Link>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        {/* gallery */}
        <div className="min-w-0 space-y-5">
          <ProductGallery images={images} alt={detail.name} />
          {/* desktop: move description + specs under the gallery to balance */}
          {hasFillers ? (
            <div className="hidden space-y-5 md:block">
              {descBlock}
              {specsBlock}
            </div>
          ) : null}
        </div>

        {/* info */}
        <div className="min-w-0 space-y-5">
          <div>
            <h1 className="text-xl font-extrabold leading-relaxed text-ink md:text-2xl">
              {detail.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {detail.categoryName ? (
                <span className="rounded-lg bg-gold-50 px-3 py-1 text-xs font-medium text-gold-600">
                  {detail.categoryName}
                </span>
              ) : null}
              {detail.weight ? (
                <span className="rounded-lg bg-gold-50 px-3 py-1 text-xs font-medium text-gold-600">
                  وزن {toPersianDigits(detail.weight)} گرم
                </span>
              ) : null}
            </div>
          </div>

          {/* vendor */}
          {detail.vendor ? (
            <Link
              href={`/${encodeURIComponent(detail.vendor.englishName)}`}
              className="flex items-center gap-3 rounded-card border border-line p-3 transition hover:border-teal-300"
            >
              <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-canvas">
                {detail.vendor.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={detail.vendor.imageUrl}
                    alt={detail.vendor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center font-bold text-teal-700">
                    {detail.vendor.name.slice(0, 1)}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">فروشنده</p>
                <p className="truncate font-bold text-ink">{detail.vendor.name}</p>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted" />
            </Link>
          ) : null}

          {/* inline buy bar (desktop) */}
          <div className="hidden md:block">
            <BuyRow
              variant="inline"
              qty={qty}
              max={max}
              finalPrice={finalPrice}
              originalPrice={originalPrice}
              onAdd={() => add(productId, vendorId, 1, meta)}
              onInc={() => setQty(productId, vendorId, Math.min(qty + 1, max))}
              onDec={() => setQty(productId, vendorId, qty - 1)}
              onRemove={() => remove(productId, vendorId)}
            />
          </div>

          {/* price breakdown */}
          <PriceBreakdown detail={detail} />

          {/* mobile: description + specs in normal flow (desktop shows them
              under the gallery instead) */}
          {hasFillers ? (
            <div className="space-y-5 md:hidden">
              {descBlock}
              {specsBlock}
            </div>
          ) : null}
        </div>
      </div>

      {/* similar products */}
      {detail.similarProducts.length ? (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-extrabold text-ink">محصولات مرتبط</h2>
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {detail.similarProducts.map((p) => (
              <div
                key={p.id}
                className="w-[60%] shrink-0 sm:w-[260px] md:w-[240px]"
              >
                <LandingProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* fixed buy bar (mobile) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface md:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <BuyRow
            variant="fixed"
            qty={qty}
            max={max}
            finalPrice={finalPrice}
            originalPrice={originalPrice}
            onAdd={() => add(productId, vendorId, 1, meta)}
            onInc={() => setQty(productId, vendorId, Math.min(qty + 1, max))}
            onDec={() => setQty(productId, vendorId, qty - 1)}
            onRemove={() => remove(productId, vendorId)}
          />
        </div>
      </div>
    </div>
  );
}

function BuyRow({
  variant,
  qty,
  max,
  finalPrice,
  originalPrice,
  onAdd,
  onInc,
  onDec,
  onRemove,
}: {
  variant: "inline" | "fixed";
  qty: number;
  max: number;
  finalPrice: number;
  originalPrice?: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}) {
  const wrap =
    variant === "inline"
      ? "flex items-center justify-between gap-3 rounded-card border border-line bg-surface p-4"
      : "flex items-center justify-between gap-2";
  return (
    <div className={wrap}>
      <div className="min-w-0 shrink-0">
        {originalPrice ? (
          <p className="text-xs text-muted line-through tnum">
            {formatToman(originalPrice, false)}
          </p>
        ) : null}
        <p className="text-base font-extrabold text-teal-700 tnum md:text-lg">
          {formatToman(finalPrice)}
        </p>
      </div>

      {qty > 0 ? (
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/cart"
            className="whitespace-nowrap text-xs font-medium text-teal-700 hover:underline md:text-sm"
          >
            مشاهده سبد خرید
          </Link>
          <QtyStepper
            size="sm"
            value={qty}
            atMax={qty >= max}
            onIncrement={onInc}
            onDecrement={onDec}
            onRemove={onRemove}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-teal-600 px-4 py-2.5 text-sm font-bold text-surface transition hover:bg-teal-700 md:max-w-xs md:px-6"
        >
          <CartIcon className="h-4 w-4 shrink-0" />
          افزودن به سبد خرید
        </button>
      )}
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-muted">{label}</span>
      <span
        className={`tnum ${strong ? "text-lg font-extrabold text-ink" : "font-medium text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}

function amountWithPercent(m: Money) {
  return `${formatToman(m.rawValue)} (${toPersianDigits(m.percent)}٪)`;
}

function PriceBreakdown({ detail }: { detail: ProductDetail }) {
  return (
    <section className="rounded-card bg-surface p-4 shadow-card md:p-5">
      <h2 className="mb-1 text-base font-bold text-ink">توضیح کالا</h2>
      <div className="divide-y divide-line">
        {detail.weight ? (
          <Row label="وزن" value={`${toPersianDigits(detail.weight)} گرم`} />
        ) : null}
        {detail.pureMassPrice ? (
          <Row label="قیمت خالص" value={formatToman(detail.pureMassPrice)} />
        ) : null}
        {detail.laborFee.rawValue ? (
          <Row label="اجرت" value={amountWithPercent(detail.laborFee)} />
        ) : null}
        {detail.interest.rawValue ? (
          <Row label="سود فروشنده" value={amountWithPercent(detail.interest)} />
        ) : null}
        {detail.tax.rawValue ? (
          <Row label="مالیات" value={amountWithPercent(detail.tax)} />
        ) : null}
        {detail.extraCost ? (
          <Row label="هزینه‌های جانبی" value={formatToman(detail.extraCost)} />
        ) : null}
        {detail.discount.percent > 0 && detail.discount.rawValue > 0 ? (
          <Row
            label="تخفیف"
            value={`${formatToman(detail.discount.rawValue)} (${toPersianDigits(detail.discount.percent)}٪)`}
          />
        ) : null}
        <Row label="قیمت نهایی" value={formatToman(detail.totalPrice)} strong />
      </div>
    </section>
  );
}
