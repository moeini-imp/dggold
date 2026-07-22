import Link from "next/link";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import { ChevronLeft } from "@/components/ui/icons";
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
      {/* green divider between consecutive product shelves */}
      <div className="mb-8 h-px bg-gradient-to-l from-transparent via-teal-600/60 to-transparent" />

      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="flex items-center gap-2 text-[22px] font-extrabold text-ink">
          {component.name}
          {component.badge ? <span>{component.badge}</span> : null}
        </h2>
        {component.hasMore ? (
          <Link
            href={moreHref}
            className="flex items-center gap-0.5 text-sm font-semibold text-teal-700"
          >
            {component.buttonText || "مشاهده همه"}
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      {/* Cap to one desktop row (4 cols) so a section with 5+ products doesn't
          wrap into a lonely second row; the rest live behind "مشاهده همه". */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5">
        {component.products.slice(0, 4).map((p) => (
          <LandingProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
