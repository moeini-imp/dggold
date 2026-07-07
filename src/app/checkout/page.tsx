import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { getPaymentGateways, buildMockGateways } from "@/lib/shop/payment";
import { getShippingTypes, buildMockShippingTypes } from "@/lib/shop/shipping";

export const metadata: Metadata = {
  title: "تسویه حساب | دیجی گلد",
};

export default async function CheckoutPage() {
  const [gateways, shippingTypes] = await Promise.all([
    getPaymentGateways().then((g) => g ?? buildMockGateways()),
    getShippingTypes().then((s) => s ?? buildMockShippingTypes()),
  ]);
  return <CheckoutView gateways={gateways} shippingTypes={shippingTypes} />;
}
