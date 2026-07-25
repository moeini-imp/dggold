"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ChevronLeft, PackageIcon, TruckIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import { getOrderHistory, type UserOrder } from "@/lib/shop/userOrders";

export function statusTone(statusName: string): string {
  if (statusName.includes("لغو") || statusName.includes("ناموفق"))
    return "bg-red-50 text-danger";
  if (statusName.includes("تحویل")) return "bg-green-50 text-success";
  return "bg-teal-50 text-teal-700";
}

export function OrdersHistoryView() {
  const router = useRouter();
  const { isAuthenticated, hydrated, accessToken } = useAuth();
  const [orders, setOrders] = useState<UserOrder[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login?redirect=/profile/orders");
    }
  }, [hydrated, isAuthenticated, router]);

  const load = useCallback(() => {
    if (!accessToken) return;
    setLoading(true);
    setError(false);
    getOrderHistory(accessToken)
      .then(setOrders)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [accessToken]);

  useEffect(() => {
    queueMicrotask(() => load());
  }, [load]);

  if (!hydrated || !isAuthenticated || loading) {
    return <div className="py-24 text-center text-muted">در حال بارگذاری…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
      <h1 className="mb-5 text-xl font-extrabold text-ink md:text-2xl">
        سفارش‌های من
      </h1>

      {error ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="font-medium text-ink">دریافت سفارش‌ها ناموفق بود.</p>
          <button
            type="button"
            onClick={load}
            className="rounded-btn bg-teal-600 px-6 py-2.5 text-sm font-bold text-surface hover:bg-teal-700"
          >
            تلاش مجدد
          </button>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-canvas text-muted">
            <PackageIcon className="h-9 w-9" />
          </span>
          <p className="text-lg font-bold text-ink">هنوز سفارشی ندارید</p>
          <Link
            href="/"
            className="rounded-btn bg-teal-600 px-6 py-2.5 text-sm font-bold text-surface hover:bg-teal-700"
          >
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/profile/orders/${o.id}`}
              className="block rounded-card bg-surface p-4 shadow-card transition hover:shadow-pop"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {o.deliveryCode ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-success ring-1 ring-inset ring-success/20">
                      <TruckIcon className="h-3.5 w-3.5" />
                      کد تحویل
                      <span className="tnum">
                        {toPersianDigits(o.deliveryCode)}
                      </span>
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone(o.statusName)}`}
                  >
                    {o.statusName}
                  </span>
                </div>
                <span className="text-xs text-muted tnum" dir="ltr">
                  {o.trackCode}
                </span>
              </div>

              {/* product thumbnails + names */}
              <div className="mt-3 flex items-center gap-2">
                {o.products.slice(0, 4).map((p, i) => (
                  <span
                    key={i}
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-canvas"
                  >
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </span>
                ))}
                <span className="min-w-0 flex-1 truncate text-sm text-ink">
                  {o.products[0]?.name}
                  {o.products.length > 1
                    ? ` و ${toPersianDigits(o.products.length - 1)} کالای دیگر`
                    : ""}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                <span className="text-sm text-muted">مبلغ کل</span>
                <span className="flex items-center gap-1 font-bold text-teal-700 tnum">
                  {formatToman(o.totalPrice)}
                  <ChevronLeft className="h-4 w-4 text-muted" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
