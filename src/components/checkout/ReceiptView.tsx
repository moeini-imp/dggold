"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { toPersianDigits } from "@/lib/format";
import { trackOrder, type UserOrder } from "@/lib/shop/userOrders";

/**
 * Payment receipt. The backend redirects here after the gateway with the
 * actual order id: /receipt/success?id=<orderId> or /receipt/failed?id=…
 * Details come from Order/TrackOrderByOrderId.
 */
export function ReceiptView({
  status,
}: {
  status: "success" | "failed" | "pending";
}) {
  const params = useSearchParams();
  const orderId = params.get("id") ?? "";
  const { accessToken, hydrated } = useAuth();

  const [order, setOrder] = useState<UserOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    if (!orderId || !accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    trackOrder(accessToken, orderId)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderId, accessToken]);

  useEffect(() => {
    if (hydrated) {
      queueMicrotask(() => load());
    }
  }, [hydrated, load]);

  const ui = {
    success: {
      color: "text-teal-600",
      bg: "bg-teal-50",
      title: "پرداخت با موفقیت انجام شد",
      desc: "سفارش شما ثبت شد و در حال پردازش است.",
    },
    failed: {
      color: "text-danger",
      bg: "bg-red-50",
      title: "پرداخت ناموفق بود",
      desc: "در صورت کسر مبلغ از حساب شما، حداکثر تا ۷۲ ساعت آینده به حساب شما باز می‌گردد.",
    },
    pending: {
      color: "text-gold-600",
      bg: "bg-gold-50",
      title: "در حال بررسی پرداخت",
      desc: "نتیجه پرداخت به‌زودی مشخص می‌شود. وضعیت سفارش را از پروفایل دنبال کنید.",
    },
  }[status];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <div className="mb-10 hidden md:block">
        <CheckoutSteps active="done" />
      </div>

      {/* status banner */}
      <div className="flex flex-col items-center gap-4 rounded-card bg-surface p-8 text-center shadow-card">
        <span
          className={`grid h-20 w-20 place-items-center rounded-full ${ui.bg} ${ui.color}`}
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
            {status === "failed" ? (
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            ) : status === "success" ? (
              <path
                d="m5 13 4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 7v5l3 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </span>

        <h1 className="text-xl font-extrabold text-ink">{ui.title}</h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted">{ui.desc}</p>
      </div>

      {/* order details */}
      {loading ? (
        <p className="py-10 text-center text-muted">
          در حال دریافت جزئیات سفارش…
        </p>
      ) : order ? (
        <>
          {order.address ? (
            <section className="mt-4 rounded-card bg-surface p-4 shadow-card md:p-5">
              <h2 className="mb-2 font-bold text-ink">آدرس تحویل</h2>
              {order.addressTitle ? (
                <p className="text-sm font-medium text-teal-700">
                  {order.addressTitle}
                </p>
              ) : null}
              <p className="mt-1 text-sm leading-relaxed text-ink/80">
                {order.address}
              </p>
            </section>
          ) : null}
        </>
      ) : orderId ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-card bg-surface p-6 text-center shadow-card">
          {error ? (
            <>
              <p className="text-sm text-muted">
                دریافت جزئیات سفارش ناموفق بود.
              </p>
              <button
                type="button"
                onClick={load}
                className="rounded-btn bg-teal-600 px-6 py-2 text-sm font-bold text-surface hover:bg-teal-700"
              >
                تلاش مجدد
              </button>
            </>
          ) : (
            <p className="text-sm text-muted">
              برای مشاهده جزئیات سفارش وارد حساب خود شوید.
            </p>
          )}
          <p className="text-xs text-muted tnum" dir="ltr">
            {toPersianDigits(orderId)}
          </p>
        </div>
      ) : null}

      <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        <Link
          href="/profile/orders"
          className="flex-1 rounded-btn bg-teal-600 py-3 text-center font-bold text-surface transition hover:bg-teal-700"
        >
          سفارش‌های من
        </Link>
        <Link
          href="/"
          className="flex-1 rounded-btn border border-line py-3 text-center font-medium text-ink transition hover:border-teal-300"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}
