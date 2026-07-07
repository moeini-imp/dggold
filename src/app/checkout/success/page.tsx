import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutSuccess } from "@/components/checkout/CheckoutSuccess";

export const metadata: Metadata = {
  title: "سفارش ثبت شد | دیجی گلد",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted">در حال بارگذاری…</div>
      }
    >
      <CheckoutSuccess />
    </Suspense>
  );
}
