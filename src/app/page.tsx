import { LandingSlider } from "@/components/home/LandingSlider";
import { LandingProductSection } from "@/components/home/LandingProductSection";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomePaymentGateways } from "@/components/home/HomePaymentGateways";
import { getLandingComponents, buildMockLanding } from "@/lib/shop/landing";
import { getShopCategories, buildMockCategories } from "@/lib/shop/category";
import { getPaymentGateways, buildMockGateways } from "@/lib/shop/payment";

export default async function Home() {
  // Homepage is composed of backend-defined components; fall back to mock
  // content (same shape) when the API is unreachable.
  const [components, categories, gateways] = await Promise.all([
    getLandingComponents("shop").then((c) => c ?? buildMockLanding()),
    getShopCategories().then((c) => c ?? buildMockCategories()),
    getPaymentGateways().then((g) => g ?? buildMockGateways()),
  ]);

  const sliders = components.filter((c) => c.type === "Slider");
  const sections = components.filter((c) => c.type === "Product");

  return (
    <div className="pb-8">
      {sliders.map((c, i) => (
        <LandingSlider key={`${c.id}-${i}`} images={c.images} />
      ))}

      <HomeCategories categories={categories} />
      <HomePaymentGateways gateways={gateways} />

      {sections.map((c, i) => (
        <LandingProductSection key={`${c.id}-${i}`} component={c} />
      ))}
    </div>
  );
}
