import Link from "next/link";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import { ChevronLeft } from "@/components/ui/icons";
import type { LandingComponent } from "@/lib/shop/landing";

export function LandingProductSection({
  component,
}: {
  component: LandingComponent;
}) {
  if (!component.products.length) return null;
  const moreHref = component.url || "/shop";

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 md:px-6">
      <div className="flex items-center justify-between rounded-card bg-teal-700 px-4 py-3 text-surface md:px-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold md:text-xl">
          {component.name}
          {component.badge ? <span>{component.badge}</span> : null}
        </h2>
        {component.hasMore ? (
          <Link
            href={moreHref}
            className="flex items-center gap-1 rounded-btn bg-teal-800/60 px-3 py-1.5 text-sm font-medium transition hover:bg-teal-800"
          >
            {component.buttonText || "مشاهده بیشتر"}
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto pb-2">
        {component.products.map((p) => (
          <div
            key={p.id}
            className="w-[44%] shrink-0 snap-start sm:w-[260px] md:w-[240px]"
          >
            <LandingProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
