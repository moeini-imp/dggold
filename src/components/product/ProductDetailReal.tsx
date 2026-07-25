"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { ProductGallery } from "@/components/product/ProductGallery";
import { OtherVendors } from "@/components/product/OtherVendors";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { ChevronDown, ChevronLeft, CartIcon, CheckIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import { formatGranule } from "@/lib/wallet/granule";
import { psychologicalOffer } from "@/lib/shop/pricing";
import type { CartLineMeta } from "@/lib/types";
import type { ProductDetail, Money } from "@/lib/shop/product";
import type { LandingProduct } from "@/lib/shop/landing";

export function ProductDetailReal({
  detail,
  related,
  granuleSoot = 0,
}: {
  detail: ProductDetail;
  related: LandingProduct[];
  granuleSoot?: number;
}) {
  const { getQuantity, add, setQty, remove, openModal } = useCart();

  const productId = String(detail.id);
  const vendorId = String(detail.vendor?.id ?? 0);
  const max = detail.countAvailable || 10;
  const qty = getQuantity(productId, vendorId);

  const offer = psychologicalOffer(
    detail.cashPrice,
    detail.psychologicalOfferPriceRatio,
  );
  const finalPrice = offer.finalPrice;
  const originalPrice = offer.originalPrice || undefined;

  // Cheapest in-stock offer from other vendors (drives the purchase-card teaser).
  const inStockOthers = detail.otherVendors.filter((v) => v.countAvailable > 0);
  const otherMinPrice = inStockOthers.length
    ? Math.min(...inStockOthers.map((v) => v.cashPrice))
    : 0;

  const meta: CartLineMeta = {
    slug: detail.slug,
    title: detail.name,
    imageUrl: detail.imagesUrl[0] ?? "",
    vendorName: detail.vendor?.name ?? "دیجی گلد",
    unitPrice: finalPrice,
    creditUnitPrice: detail.creditPrice || undefined,
    originalUnitPrice: originalPrice,
    maxQuantity: max,
  };

  const images = detail.imagesUrl.length ? detail.imagesUrl : ["placeholder:gold"];
  const addAndOpen = () => {
    add(productId, vendorId, 1, meta);
    openModal();
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 pb-36 lg:pb-16 md:px-8">
      {/* Breadcrumbs Navigation */}
      <nav className="mb-4 sm:mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted min-w-0">
        <Link href="/" className="hover:text-teal-700 transition">
          خانه
        </Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-teal-700 transition">
          دسته‌بندی‌ها
        </Link>
        {detail.categoryName ? (
          <>
            <span>/</span>
            <Link
              href={`/category/${encodeURIComponent(detail.categoryName)}`}
              className="hover:text-teal-700 transition truncate max-w-[120px] sm:max-w-none"
            >
              {detail.categoryName}
            </Link>
          </>
        ) : null}
        <span>/</span>
        <span className="truncate font-semibold text-ink max-w-[150px] sm:max-w-xs">{detail.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 items-start">
        {/* Right Column (RTL Start) - Gallery & Key Specs */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <ProductGallery
            images={images}
            alt={detail.name}
            karat={detail.carat}
            weight={detail.weight}
          />

          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/80 border border-emerald-100 rounded-xl px-3.5 py-2.5">
            <CheckIcon className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>تایید اصالت طلا توسط فروشنده معتبر اتحادیه</span>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-xs">
            <h3 className="text-xs font-extrabold text-muted uppercase tracking-wider mb-3.5">
              مشخصات فنی و عیار
            </h3>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <SpecCard icon="⚖️" label="وزن خالص" value={`${toPersianDigits(detail.weight)} گرم`} />
              <SpecCard
                icon="🌟"
                label="عیار طلا"
                value={detail.carat ? `${toPersianDigits(detail.carat)} عیار (۷۵۰)` : "۱۸ عیار"}
              />
              <SpecCard icon="🛠️" label="نوع محصول" value={detail.categoryName || "طلا"} />
              <SpecCard
                icon="🏬"
                label="فروشنده"
                value={detail.vendor?.name || "دیجی گلد"}
              />
            </div>
          </div>
        </div>

        {/* Left Column (RTL End) - Product Details & Purchase Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Header Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {detail.categoryName ? (
                <span className="inline-flex rounded-full bg-gold-100 px-3 py-1 text-xs font-extrabold text-gold-700">
                  {detail.categoryName}
                </span>
              ) : null}
              <span className="text-xs text-muted">
                کد کالا: <span className="font-semibold text-ink tnum">{toPersianDigits(detail.id)}</span>
              </span>
            </div>

            <h1 className="mt-2.5 text-lg sm:text-xl font-extrabold leading-snug text-ink lg:text-2xl">
              {detail.name}
            </h1>
          </div>

          {/* Primary Purchase Card */}
          <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-card space-y-5">
            {/* Vendor info */}
            <div className="flex items-center justify-between border-b border-line pb-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <span className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl bg-teal-600 text-sm sm:text-base font-extrabold text-gold-300 shadow-xs">
                  {detail.vendor?.name.charAt(0) || "د"}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-muted">فروشنده رسمی</p>
                  <p className="text-xs sm:text-sm font-bold text-ink truncate">
                    {detail.vendor?.name || "دیجی گلد"}
                  </p>
                </div>
              </div>
              {detail.vendor?.englishName ? (
                <Link
                  href={`/${encodeURIComponent(detail.vendor.englishName)}`}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-0.5 shrink-0"
                >
                  <span>فروشگاه</span>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>

            {/* Price Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>قیمت محاسباتی طلا:</span>
                <span className={detail.countAvailable > 0 ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                  {detail.countAvailable > 0 ? "موجود در انبار" : "ناموجود"}
                </span>
              </div>

              {originalPrice ? (
                <p className="text-xs sm:text-sm text-muted line-through tnum">
                  {formatToman(originalPrice, false)} تومان
                </p>
              ) : null}

              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-ink tnum">
                  {formatToman(finalPrice, false)}
                </span>
                <span className="text-xs font-semibold text-muted">تومان</span>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-teal-700 border border-teal-100">
                  ✓ پرداخت نقدی
                </span>
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-amber-700 border border-amber-100">
                  ✓ اقساطی (بالون)
                </span>
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 border border-emerald-100">
                  ✓ با کیف پول
                </span>
              </div>

              {detail.otherVendors.length ? (
                <a
                  href="#other-vendors"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
                >
                  <span>
                    از {toPersianDigits(detail.otherVendors.length)} فروشنده دیگر
                    {otherMinPrice ? (
                      <>
                        ، از{" "}
                        <span className="tnum">
                          {formatToman(otherMinPrice, false)}
                        </span>{" "}
                        تومان
                      </>
                    ) : null}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>

            {/* Stepper if in cart */}
            {qty > 0 ? (
              <div className="flex items-center justify-between rounded-xl bg-canvas p-3 border border-line">
                <span className="text-xs font-bold text-ink">تعداد در سبد:</span>
                <QtyStepper
                  value={qty}
                  atMax={qty >= max}
                  onIncrement={() => setQty(productId, vendorId, Math.min(qty + 1, max))}
                  onDecrement={() => setQty(productId, vendorId, qty - 1)}
                  onRemove={() => remove(productId, vendorId)}
                />
              </div>
            ) : null}

            {/* CTA */}
            <button
              type="button"
              onClick={addAndOpen}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-teal-600 py-3.5 text-xs sm:text-sm font-bold text-gold-300 transition hover:bg-teal-700 shadow-md active:scale-[0.98]"
            >
              <CartIcon className="h-5 w-5" />
              <span>افزودن به سبد خرید</span>
            </button>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-line pt-3.5 text-[11px] text-muted">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>تحویل فیزیکی بیمه‌شده</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>تضمین عیار ۷۵۰ (۱۸ عیار)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>فاکتور رسمی اتحادیه</span>
              </div>
            </div>
          </div>

          {/* Other vendors offering this same item */}
          <OtherVendors detail={detail} />

          {/* Granule Wallet Equivalent Card */}
          {granuleSoot > 0 ? (
            <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-gold-100/60 to-amber-500/10 border border-gold-300/50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-ink">خرید مستقیم با کیف پول طلا</h4>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  ارزش این محصول معادل <strong className="text-gold-700 tnum">{formatGranule(granuleSoot)}</strong> طلای ۱۸ عیار است.
                </p>
              </div>
              <Link
                href="/wallet"
                className="shrink-0 rounded-xl bg-gold-500 px-3.5 py-2 text-center text-xs font-bold text-teal-950 transition hover:bg-gold-400 shadow-xs"
              >
                کیف پول
              </Link>
            </div>
          ) : null}

          {/* Price Breakdown Transparency Invoice */}
          <PriceBreakdown detail={detail} />

          {/* Description */}
          {detail.description ? <IntroSection text={detail.description} /> : null}
        </div>
      </div>

      {/* Related Products Carousel */}
      {related.length ? (
        <section className="mt-12 sm:mt-16 border-t border-line pt-8 sm:pt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-ink md:text-xl">
              محصولات مرتبط و مشابه
            </h2>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
            >
              <span>مشاهده همه</span>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 sm:gap-4 md:gap-5">
            {related.slice(0, 4).map((p) => (
              <LandingProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Mobile Fixed Bottom Purchase Bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line/80 bg-surface/95 backdrop-blur-md lg:hidden shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 shrink-0">
              <p className="text-[10px] text-muted">قیمت نهایی:</p>
              <p className="text-sm sm:text-base font-extrabold text-teal-700 tnum">
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
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-teal-600 px-4 sm:px-5 py-2.5 text-xs font-bold text-gold-300 transition hover:bg-teal-700 shadow-sm"
              >
                <CartIcon className="h-4 w-4" />
                <span>افزودن به سبد</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-canvas p-3 border border-line/70">
      <span className="text-xl">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted">{label}</p>
        <p className="text-xs font-bold text-ink truncate tnum">{value}</p>
      </div>
    </div>
  );
}

function IntroSection({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
      <h3 className="mb-3 text-xs font-extrabold text-muted uppercase tracking-wider">
        توضیحات و معرفی محصول
      </h3>
      <div
        className={`relative overflow-hidden transition-[max-height] duration-300 ${
          expanded ? "max-h-[1000px]" : "max-h-[120px]"
        }`}
      >
        <p className="whitespace-pre-line text-xs leading-relaxed text-ink/80">
          {text}
        </p>
        {!expanded ? (
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface to-transparent" />
        ) : null}
      </div>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
        >
          <span>{expanded ? "بستن توضیحات" : "ادامه توضیحات"}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </section>
  );
}

function amountWithPercent(m: Money) {
  return `${formatToman(m.rawValue)} (${toPersianDigits(m.percent)}٪)`;
}

function PriceBreakdown({ detail }: { detail: ProductDetail }) {
  const rows: { label: string; value: string; strong?: boolean }[] = [];
  if (detail.pureMassPrice) rows.push({ label: "قیمت خالص طلا", value: formatToman(detail.pureMassPrice) });
  if (detail.laborFee.rawValue) rows.push({ label: "اجرت ساخت", value: amountWithPercent(detail.laborFee) });
  if (detail.interest.rawValue) rows.push({ label: "سود فروشنده", value: amountWithPercent(detail.interest) });
  if (detail.tax.rawValue) rows.push({ label: "مالیات بر ارزش افزوده", value: amountWithPercent(detail.tax) });
  if (detail.extraCost) rows.push({ label: "هزینه‌های جانبی", value: formatToman(detail.extraCost) });
  if (detail.discount.percent > 0 && detail.discount.rawValue > 0) {
    rows.push({
      label: "تخفیف ویژه",
      value: `${formatToman(detail.discount.rawValue)} (${toPersianDigits(detail.discount.percent)}٪)`,
    });
  }
  if (!rows.length) return null;
  rows.push({ label: "قیمت نهایی فاکتور", value: formatToman(detail.totalPrice), strong: true });

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b border-line pb-3">
        <h3 className="text-xs font-extrabold text-muted uppercase tracking-wider">
          شفافیت و جزئیات محاسبه قیمت
        </h3>
        <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
          فاکتور رسمی
        </span>
      </div>

      <div className="divide-y divide-line/60">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-2.5 text-xs">
            <span className={r.strong ? "font-bold text-ink" : "text-muted"}>{r.label}</span>
            <span
              className={`tnum ${r.strong ? "text-sm font-extrabold text-teal-700" : "font-semibold text-ink"}`}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
