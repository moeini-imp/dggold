"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { getOrder } from "@/lib/orders";
import { formatToman, formatJalali, toPersianDigits } from "@/lib/format";
import type { Order } from "@/lib/types";

function CheckMark() {
  return (
    <span className="grid h-20 w-20 place-items-center rounded-full bg-teal-50 text-teal-600">
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
        <path
          d="m5 13 4 4L19 7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function CheckoutSuccess() {
  const params = useSearchParams();
  const code = params.get("code") ?? "";
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrder(getOrder(code) ?? null);
  }, [code]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <div className="mb-10 hidden md:block">
        <CheckoutSteps active="done" />
      </div>

      <div className="flex flex-col items-center gap-4 rounded-card bg-surface p-8 text-center shadow-card">
        <CheckMark />
        <h1 className="text-xl font-extrabold text-ink">
          سفارش شما با موفقیت ثبت شد
        </h1>
        <p className="max-w-sm text-sm text-muted">
          از خرید شما متشکریم. جزئیات سفارش برای شما ارسال خواهد شد.
        </p>

        {order ? (
          <div className="mt-2 w-full max-w-sm space-y-2 rounded-card border border-line p-4 text-sm">
            <Row label="کد سفارش" value={toPersianDigits(order.code)} />
            <Row label="تاریخ سفارش" value={formatJalali(order.createdAt)} />
            <Row label="مبلغ پرداختی" value={formatToman(order.total)} strong />
          </div>
        ) : null}

        <div className="mt-4 flex w-full max-w-sm flex-col gap-2 sm:flex-row">
          <Link
            href="/profile/orders"
            className="flex-1 rounded-btn bg-teal-600 py-3 text-center font-bold text-surface transition hover:bg-teal-700"
          >
            مشاهده سفارش‌ها
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-btn border border-line py-3 text-center font-medium text-ink transition hover:border-teal-300"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={`tnum ${strong ? "font-extrabold text-teal-700" : "font-medium text-ink"}`}>
        {value}
      </span>
    </div>
  );
}
