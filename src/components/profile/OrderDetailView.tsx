"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { statusTone } from "@/components/profile/OrdersHistoryView";
import { formatToman, toPersianDigits } from "@/lib/format";
import { trackOrder, type UserOrder } from "@/lib/shop/userOrders";

export function OrderDetailView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { isAuthenticated, hydrated, accessToken } = useAuth();
  const [order, setOrder] = useState<UserOrder | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(`/login?redirect=/profile/orders/${orderId}`);
    }
  }, [hydrated, isAuthenticated, router, orderId]);

  const load = useCallback(() => {
    if (!accessToken) return;
    setLoading(true);
    setError(false);
    trackOrder(accessToken, orderId)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [accessToken, orderId]);

  useEffect(load, [load]);

  if (!hydrated || !isAuthenticated || loading) {
    return <div className="py-24 text-center text-muted">در حال بارگذاری…</div>;
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="font-medium text-ink">دریافت جزئیات سفارش ناموفق بود.</p>
        <button
          type="button"
          onClick={load}
          className="rounded-btn bg-teal-600 px-6 py-2.5 text-sm font-bold text-surface hover:bg-teal-700"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
      <h1 className="mb-5 text-xl font-extrabold text-ink md:text-2xl">
        جزئیات سفارش
      </h1>

      {/* status + track code */}
      <section className="rounded-card bg-surface p-4 shadow-card md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${statusTone(order.statusName)}`}
          >
            {order.statusName}
          </span>
          <div className="text-left">
            <p className="text-xs text-muted">کد پیگیری</p>
            <p className="break-all text-sm font-medium text-ink tnum" dir="ltr">
              {order.trackCode}
            </p>
          </div>
        </div>
      </section>

      {/* address */}
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

      {/* items */}
      <section className="mt-4 rounded-card bg-surface p-4 shadow-card md:p-5">
        <h2 className="mb-3 font-bold text-ink">اقلام سفارش</h2>
        <div className="divide-y divide-line">
          {order.products.map((p, i) => (
            <div key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-canvas">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium leading-relaxed text-ink">
                  {p.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-muted tnum">
                    {toPersianDigits(p.quantity)} عدد
                  </span>
                  <span className="text-sm font-bold text-teal-700 tnum">
                    {formatToman(p.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <span className="font-bold text-ink">مبلغ کل</span>
          <span className="text-lg font-extrabold text-teal-700 tnum">
            {formatToman(order.totalPrice)}
          </span>
        </div>
      </section>
    </div>
  );
}
