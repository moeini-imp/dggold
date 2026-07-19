"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useResolvedCartLines } from "@/components/cart/useResolvedCartLines";
import { useAuth } from "@/components/auth/AuthProvider";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { CartIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-canvas text-muted">
        <CartIcon className="h-9 w-9" />
      </span>
      <p className="text-lg font-bold text-ink">سبد خرید شما خالی است</p>
      <p className="max-w-xs text-sm text-muted">
        هنوز محصولی به سبد خرید اضافه نکرده‌اید. از فروشگاه دیدن کنید.
      </p>
      <Link
        href="/"
        className="rounded-btn bg-teal-600 px-6 py-2.5 text-sm font-bold text-surface transition hover:bg-teal-700"
      >
        رفتن به فروشگاه
      </Link>
    </div>
  );
}

function SummaryRows({
  count,
  total,
}: {
  count: number;
  total: number;
}) {
  return (
    <>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          جمع جزء ({toPersianDigits(count)} کالا)
        </span>
        <span className="font-medium text-ink tnum">{formatToman(total)}</span>
      </div>
      <div className="my-3 border-t border-line" />
      <div className="flex items-center justify-between">
        <span className="font-bold text-ink">مجموع</span>
        <span className="text-lg font-extrabold text-teal-700 tnum">
          {formatToman(total)}
        </span>
      </div>
    </>
  );
}

export function CartView() {
  const router = useRouter();
  const { hydrated, setQty, remove } = useCart();
  const { isAuthenticated } = useAuth();
  const details = useResolvedCartLines();

  // Checkout requires login: go straight to checkout if signed in, else to the
  // login/OTP flow with a redirect back to checkout.
  const goToCheckout = () => {
    router.push(
      isAuthenticated ? "/checkout" : "/login?redirect=/checkout",
    );
  };

  const total = details.reduce((s, l) => s + l.lineTotal, 0);
  const count = details.reduce((s, l) => s + l.quantity, 0);

  if (!hydrated) {
    return (
      <div className="py-24 text-center text-muted">در حال بارگذاری…</div>
    );
  }

  if (details.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-40 md:px-6 md:py-8 md:pb-8">
      <div className="mb-8 hidden md:block">
        <CheckoutSteps active="cart" />
      </div>

      <h1 className="mb-5 text-xl font-extrabold text-ink md:text-2xl">
        سبد خرید
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* line items */}
        <div className="min-w-0 space-y-3 md:col-span-2">
          {details.map((line) => (
            <CartLineItem
              key={`${line.productId}-${line.vendorId}`}
              line={line}
              onSetQty={(q) => setQty(line.productId, line.vendorId, q)}
              onRemove={() => remove(line.productId, line.vendorId)}
            />
          ))}
        </div>

        {/* summary (desktop) */}
        <aside className="hidden md:block">
          <div className="sticky top-20 rounded-card bg-surface p-5 shadow-card">
            <h2 className="mb-4 font-bold text-ink">خلاصه سفارش</h2>
            <SummaryRows count={count} total={total} />
            <button
              type="button"
              onClick={goToCheckout}
              className="mt-5 block w-full rounded-btn bg-teal-600 py-3 text-center font-bold text-surface transition hover:bg-teal-700"
            >
              تکمیل سفارش و پرداخت
            </button>
          </div>
        </aside>
      </div>

      {/* sticky pay bar (mobile) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted">مجموع سفارش</p>
            <p className="text-base font-extrabold text-teal-700 tnum">
              {formatToman(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={goToCheckout}
            className="flex-1 rounded-btn bg-teal-600 px-6 py-3 text-center font-bold text-surface transition hover:bg-teal-700"
          >
            پرداخت
          </button>
        </div>
      </div>
    </div>
  );
}
