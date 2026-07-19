import Link from "next/link";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import type { LandingComponent } from "@/lib/shop/landing";

/** A backend-composed homepage product section — name/order/content stay
 *  fully backend-controlled; only the visual treatment is restyled. */
export function LandingProductSection({
  component,
}: {
  component: LandingComponent;
}) {
  if (!component.products.length) return null;
  const moreHref = component.url || `/landing/${component.id}`;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="flex items-center gap-2 text-[22px] font-extrabold text-ink">
          {component.name}
          {component.badge ? <span>{component.badge}</span> : null}
        </h2>
        {component.hasMore ? (
          <Link href={moreHref} className="text-sm font-semibold text-teal-700">
            {component.buttonText || "مشاهده همه"} ‹
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5">
        {component.products.map((p) => (
          <LandingProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
