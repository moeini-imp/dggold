import { Suspense } from "react";
import type { Metadata } from "next";
import { BaloanCheckout } from "@/components/checkout/BaloanCheckout";

export const metadata: Metadata = {
  title: "پرداخت اعتباری بالون | دیجی گلد",
};

/**
 * Standalone Baloan credit checkout. The wallet API redirects here (a uniform
 * gateway hand-off) after it has already checked the user's credit and sent the
 * first OTP: /baloan/checkout?paymentIntentId=<guid>&amount=<toman>.
 * `amount` is display-only — settle always uses the server-side amount.
 */
export default async function BaloanCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentIntentId?: string; amount?: string }>;
}) {
  const { paymentIntentId, amount } = await searchParams;
  const amountToman = Number(amount);

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted">در حال بارگذاری…</div>
      }
    >
      <BaloanCheckout
        paymentIntentId={paymentIntentId ?? ""}
        amountToman={Number.isFinite(amountToman) ? amountToman : 0}
      />
    </Suspense>
  );
}
