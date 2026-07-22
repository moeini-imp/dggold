import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { getPaymentGateways, buildMockGateways } from "@/lib/shop/payment";
import { getShippingTypes, buildMockShippingTypes } from "@/lib/shop/shipping";
import { getLastAssetPrices, buildMockAssetPrices } from "@/lib/shop/assetPrice";

export const metadata: Metadata = {
  title: "تسویه حساب | دیجی گلد",
};

export default async function CheckoutPage() {
  const [gateways, shippingTypes, prices] = await Promise.all([
    getPaymentGateways().then((g) => g ?? buildMockGateways()),
    getShippingTypes().then((s) => s ?? buildMockShippingTypes()),
    getLastAssetPrices().then((p) => p ?? buildMockAssetPrices()),
  ]);
  const goldPricePerGram = prices.find((p) => p.symbol === 2)?.price ?? 0;
  return (
    <CheckoutView
      gateways={gateways}
      shippingTypes={shippingTypes}
      goldPricePerGram={goldPricePerGram}
    />
  );
}
