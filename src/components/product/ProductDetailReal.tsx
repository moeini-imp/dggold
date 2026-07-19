"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { ProductGallery } from "@/components/product/ProductGallery";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { ChevronDown, ChevronLeft, CartIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { CartLineMeta } from "@/lib/types";
import type { ProductDetail, Money } from "@/lib/shop/product";
import type { LandingProduct } from "@/lib/shop/landing";

export function ProductDetailReal({
  detail,
  related,
}: {
  detail: ProductDetail;
  related: LandingProduct[];
}) {
  const { getQuantity, add, setQty, remove, openModal } = useCart();

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
    vendorName: detail.vendor?.name ?? "دیجی گلد",
    unitPrice: finalPrice,
    originalUnitPrice: originalPrice,
    maxQuantity: max,
  };

  const images = detail.imagesUrl.length ? detail.imagesUrl : ["placeholder:gold"];
  const addAndOpen = () => {
    add(productId, vendorId, 1, meta);
    openModal();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 pb-44 md:px-8 md:py-8 md:pb-16">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition hover:text-teal-700"
      >
        بازگشت به فروشگاه
        <ChevronLeft className="h-4 w-4" />
      </Link>

      <div className="grid gap-7 md:grid-cols-[340px_1fr_360px] md:items-start md:gap-8">
        {/* images (rightmost in RTL) */}
        <div className="min-w-0">
          <ProductGallery images={images} alt={detail.name} />
        </div>

        {/* specs (middle) */}
        <div className="min-w-0 space-y-5">
          <div>
            {detail.categoryName ? (
              <span className="inline-flex rounded-lg bg-gold-100 px-3 py-1 text-xs font-bold text-gold-600">
                {detail.categoryName}
              </span>
            ) : null}
            <h1 className="mt-3 text-xl font-extrabold leading-relaxed text-ink md:text-[26px]">
              {detail.name}
            </h1>
            <div className="mt-2 text-[13px] text-muted">
              کد محصول: {toPersianDigits(detail.id)} ·{" "}
              {detail.countAvailable > 0 ? "موجود در انبار" : "ناموجود"}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface px-5">
            <SpecRow label="وزن" value={`${toPersianDigits(detail.weight)} گرم`} />
            {detail.carat ? (
              <SpecRow label="عیار" value={`${toPersianDigits(detail.carat)} عیار`} />
            ) : null}
            {detail.categoryName ? (
              <SpecRow label="جنس" value={detail.categoryName} />
            ) : null}
            <SpecRow label="سازنده" value={detail.vendor?.name || "دیجی گلد"} />
            <SpecRow label="ضمانت" value="اصالت کالا و فاکتور رسمی" last />
          </div>

          {detail.dynamicProperties.length ? (
            <div className="rounded-2xl border border-line bg-surface px-5">
              {detail.dynamicProperties.map((p, i) => (
                <SpecRow
                  key={p.title}
                  label={p.title}
                  value={p.value}
                  last={i === detail.dynamicProperties.length - 1}
                />
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-2.5">
            {[
              "کمترین کارمزد ساخت در بازار",
              "امکان استعلام آنلاین اصالت کالا",
              "بسته‌بندی امن و قابل استرداد تا ۷۲ ساعت",
            ].map((b) => (
              <div key={b} className="flex items-start gap-2.5 text-sm text-ink/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <PriceBreakdown detail={detail} />
        </div>

        {/* purchase (sticky) */}
        <div className="min-w-0 space-y-4.5 rounded-[20px] border border-line bg-surface p-6 md:sticky md:top-24">
          <div className="flex items-center gap-3">
            <span className="grid h-10.5 w-10.5 shrink-0 place-items-center rounded-xl bg-teal-600 text-[15px] font-extrabold text-gold-300">
              {(detail.vendor?.name || "د").charAt(0)}
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] text-muted">فروشنده</span>
              <span className="text-sm font-bold text-ink">
                {detail.vendor?.name || "دیجی گلد"}
              </span>
            </div>
          </div>

          <div className="border-t border-line pt-4">
            <p className="text-xs text-muted">
              قیمت{detail.weight ? ` (${toPersianDigits(detail.weight)} گرم)` : ""}
            </p>
            {originalPrice ? (
              <p className="mt-1 text-sm text-muted line-through tnum">
                {formatToman(originalPrice, false)}
              </p>
            ) : null}
            <p className="mt-1 text-2xl font-extrabold text-ink tnum">
              {formatToman(finalPrice)}
            </p>
            <p className="mt-1.5 text-xs font-medium text-teal-600">
              قابل خرید اقساطی
            </p>
          </div>

          {qty > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted">تعداد</span>
              <QtyStepper
                value={qty}
                atMax={qty >= max}
                onIncrement={() => setQty(productId, vendorId, Math.min(qty + 1, max))}
                onDecrement={() => setQty(productId, vendorId, qty - 1)}
                onRemove={() => remove(productId, vendorId)}
              />
            </div>
          ) : null}

          <button
            type="button"
            onClick={addAndOpen}
            className="flex w-full items-center justify-center gap-2.5 rounded-[13px] bg-teal-600 py-3.5 text-sm font-bold text-gold-300 transition hover:bg-teal-700"
          >
            <CartIcon className="h-[18px] w-[18px]" />
            افزودن به سبد خرید
          </button>

          {qty > 0 ? (
            <Link
              href="/cart"
              className="block text-center text-sm font-medium text-teal-700 hover:underline"
            >
              مشاهده سبد خرید
            </Link>
          ) : null}

          <div className="flex flex-col gap-3 pt-1">
            {["ضمانت اصالت و فاکتور رسمی", "تحویل فیزیکی در همان روز"].map((t) => (
              <div key={t} className="flex items-center gap-2.5">
                <span className="h-7.5 w-7.5 shrink-0 rounded-full bg-canvas" />
                <span className="text-xs text-ink/80">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {detail.description ? <IntroSection text={detail.description} /> : null}

      {related.length ? (
        <>
          <WeightChipsSection products={related} />
          <section className="mt-9">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-[22px] font-extrabold text-ink">محصولات مرتبط</h2>
              <Link href="/categories" className="text-sm font-semibold text-teal-700">
                مشاهده همه ‹
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5">
              {related.map((p) => (
                <LandingProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      ) : null}

      {/* fixed buy bar (mobile) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface md:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 shrink-0">
              {originalPrice ? (
                <p className="text-xs text-muted line-through tnum">
                  {formatToman(originalPrice, false)}
                </p>
              ) : null}
              <p className="text-base font-extrabold text-teal-700 tnum">
                {formatToman(finalPrice)}
              </p>
            </div>
            {qty > 0 ? (
              <QtyStepper
                size="sm"
                value={qty}
                atMax={qty >= max}
                onIncrement={() => setQty(productId, vendorId, Math.min(qty + 1, max))}
                onDecrement={() => setQty(productId, vendorId, qty - 1)}
                onRemove={() => remove(productId, vendorId)}
              />
            ) : (
              <button
                type="button"
                onClick={addAndOpen}
                className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-btn bg-teal-600 px-4 py-2.5 text-sm font-bold text-gold-300 transition hover:bg-teal-700"
              >
                <CartIcon className="h-4 w-4 shrink-0" />
                افزودن به سبد خرید
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3.5 ${last ? "" : "border-b border-line/70"}`}
    >
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-sm font-bold text-ink">{value}</span>
    </div>
  );
}

/** معرفی محصول — real product description, expandable with a fade when collapsed. */
function IntroSection({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="mt-9">
      <h2 className="mb-5 text-[22px] font-extrabold text-ink">معرفی محصول</h2>
      <div className="rounded-[20px] border border-line bg-surface p-6 md:p-8">
        <div
          className={`relative overflow-hidden transition-[max-height] duration-300 ${
            expanded ? "max-h-[2000px]" : "max-h-[150px]"
          }`}
        >
          <p className="whitespace-pre-line text-[15px] leading-8 text-ink/80">
            {text}
          </p>
          {!expanded ? (
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface to-transparent" />
          ) : null}
        </div>
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
          >
            <span>{expanded ? "بستن توضیحات" : "مشاهده بیشتر"}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * "سایر وزن‌های این محصول" — the backend has no variant-grouping concept (each
 * weight is a fully separate product), so this uses the same real
 * related-products list, styled as a chip row; each chip links to its own
 * product page rather than swapping state in place.
 */
function WeightChipsSection({ products }: { products: LandingProduct[] }) {
  return (
    <section className="mt-9">
      <h2 className="mb-5 text-[22px] font-extrabold text-ink">
        سایر وزن‌های این محصول
      </h2>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
        {products.map((p) => {
          const href = p.slug
            ? `/Product/Detail/${p.id}/${encodeURIComponent(p.slug)}`
            : `/Product/Detail/${p.id}/-`;
          return (
            <Link
              key={p.id}
              href={href}
              className="flex w-[170px] shrink-0 flex-col items-center gap-2.5 rounded-2xl border-2 border-line bg-surface px-5 py-5 text-center transition hover:border-teal-300"
            >
              <span className="h-10.5 w-[58px] rounded-lg bg-gradient-to-br from-gold-200 to-gold-500" />
              <span className="line-clamp-1 text-sm font-bold text-ink">
                {p.weight > 0 ? `${toPersianDigits(p.weight)} گرم` : p.name}
              </span>
              <span className="text-[13px] font-bold text-ink tnum">
                {formatToman(p.finalPrice)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function amountWithPercent(m: Money) {
  return `${formatToman(m.rawValue)} (${toPersianDigits(m.percent)}٪)`;
}

function PriceBreakdown({ detail }: { detail: ProductDetail }) {
  const rows: { label: string; value: string; strong?: boolean }[] = [];
  if (detail.pureMassPrice) rows.push({ label: "قیمت خالص", value: formatToman(detail.pureMassPrice) });
  if (detail.laborFee.rawValue) rows.push({ label: "اجرت", value: amountWithPercent(detail.laborFee) });
  if (detail.interest.rawValue) rows.push({ label: "سود فروشنده", value: amountWithPercent(detail.interest) });
  if (detail.tax.rawValue) rows.push({ label: "مالیات", value: amountWithPercent(detail.tax) });
  if (detail.extraCost) rows.push({ label: "هزینه‌های جانبی", value: formatToman(detail.extraCost) });
  if (detail.discount.percent > 0 && detail.discount.rawValue > 0) {
    rows.push({
      label: "تخفیف",
      value: `${formatToman(detail.discount.rawValue)} (${toPersianDigits(detail.discount.percent)}٪)`,
    });
  }
  if (!rows.length) return null;
  rows.push({ label: "قیمت نهایی", value: formatToman(detail.totalPrice), strong: true });

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="mb-1 text-sm font-bold text-ink">شفافیت قیمت</h2>
      <div className="divide-y divide-line/70">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-muted">{r.label}</span>
            <span
              className={`tnum ${r.strong ? "text-base font-extrabold text-ink" : "font-medium text-ink"}`}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
