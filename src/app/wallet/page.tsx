import type { Metadata } from "next";
import { WalletView } from "@/components/wallet/WalletView";
import { getLastAssetPrices, buildMockAssetPrices } from "@/lib/shop/assetPrice";
import { getPaymentGateways, buildMockGateways } from "@/lib/shop/payment";

export const metadata: Metadata = {
  title: "کیف پول | دیجی گلد",
};

export default async function WalletPage() {
  // Public live prices (symbol 2 = 18k) for the granule buy unit price, and
  // the same payment gateways used at product checkout.
  const [prices, gateways] = await Promise.all([
    getLastAssetPrices().then((p) => p ?? buildMockAssetPrices()),
    getPaymentGateways().then((g) => g ?? buildMockGateways()),
  ]);
  return <WalletView prices={prices} gateways={gateways} />;
}
