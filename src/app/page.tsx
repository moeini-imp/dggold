import { LandingSlider } from "@/components/home/LandingSlider";
import { LandingProductSection } from "@/components/home/LandingProductSection";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomePaymentGateways } from "@/components/home/HomePaymentGateways";
import { LivePriceBar } from "@/components/home/LivePriceBar";
import { Hero } from "@/components/home/Hero";
import { DiscountedProducts } from "@/components/home/DiscountedProducts";
import { DeliveryBanner } from "@/components/home/DeliveryBanner";
import { AboutSection } from "@/components/home/AboutSection";
import { getLandingComponents, buildMockLanding } from "@/lib/shop/landing";
import { getCategoryTree, buildMockCategoryTree } from "@/lib/shop/category";
import { getPaymentGateways, buildMockGateways } from "@/lib/shop/payment";
import { getLastAssetPrices, buildMockAssetPrices } from "@/lib/shop/assetPrice";

export default async function Home() {
  // Homepage is composed of backend-defined components; fall back to mock
  // content (same shape) when the API is unreachable.
  const [components, categories, gateways, prices] = await Promise.all([
    getLandingComponents("shop").then((c) => c ?? buildMockLanding()),
    getCategoryTree().then((c) => c ?? buildMockCategoryTree()),
    getPaymentGateways().then((g) => g ?? buildMockGateways()),
    getLastAssetPrices().then((p) => p ?? buildMockAssetPrices()),
  ]);

  const sliders = components.filter((c) => c.type === "Slider");
  const sections = components.filter((c) => c.type === "Product");

  return (
    <div className="pb-8">
      <LivePriceBar prices={prices} />
      <Hero />

      {sliders.map((c, i) => (
        <LandingSlider key={`${c.id}-${i}`} images={c.images} />
      ))}

      <HomeCategories categories={categories} />
      <HomePaymentGateways gateways={gateways} />
      <DiscountedProducts components={components} />

      {sections.map((c, i) => (
        <LandingProductSection key={`${c.id}-${i}`} component={c} />
      ))}

      <DeliveryBanner />
      <AboutSection />
    </div>
  );
}
