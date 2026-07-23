import { Suspense } from "react";
import type { Metadata } from "next";
import { BaloanCheckout } from "@/components/checkout/BaloanCheckout";

export const metadata: Metadata = {
  title: "پرداخت اعتباری بالون | دیجی گلد",
};

/**
 * Standalone Baloan credit checkout. The wallet API redirects here (a uniform
 * gateway hand-off) with the payment intent id in the query, e.g.
 * /baloan/checkout?paymentIntentId=<guid>. The OTP flow runs client-side.
 */
export default async function BaloanCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentIntentId?: string }>;
}) {
  const { paymentIntentId } = await searchParams;
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted">در حال بارگذاری…</div>
      }
    >
      <BaloanCheckout paymentIntentId={paymentIntentId ?? ""} />
    </Suspense>
  );
}
