import { LandingSlider } from "@/components/home/LandingSlider";
import { LandingProductSection } from "@/components/home/LandingProductSection";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomeVendors } from "@/components/home/HomeVendors";
import { getLandingComponents, buildMockLanding } from "@/lib/shop/landing";
import { getShopCategories, buildMockCategories } from "@/lib/shop/category";
import { getVendors, buildMockVendors } from "@/lib/shop/vendor";

export default async function Home() {
  // Homepage is composed of backend-defined components; fall back to mock
  // content (same shape) when the API is unreachable.
  const [components, categories, vendors] = await Promise.all([
    getLandingComponents("shop").then((c) => c ?? buildMockLanding()),
    getShopCategories().then((c) => c ?? buildMockCategories()),
    getVendors().then((v) => v ?? buildMockVendors()),
  ]);

  const sliders = components.filter((c) => c.type === "Slider");
  const sections = components.filter((c) => c.type === "Product");

  return (
    <div className="pb-8">
      {sliders.map((c, i) => (
        <LandingSlider key={`${c.id}-${i}`} images={c.images} />
      ))}

      <HomeCategories categories={categories} />
      <HomeVendors vendors={vendors} />

      {sections.map((c, i) => (
        <LandingProductSection key={`${c.id}-${i}`} component={c} />
      ))}
    </div>
  );
}
