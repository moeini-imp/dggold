import Link from "next/link";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import { ChevronLeft } from "@/components/ui/icons";
import type { LandingComponent } from "@/lib/shop/landing";

/**
 * "زرین‌آف"-style discounts row — there's no dedicated curated-discounts
 * endpoint, so this curates client-side from whatever real products the
 * backend's landing components already returned (any with a real discount).
 * Omitted entirely when nothing is discounted right now — no fake data.
 */
export function DiscountedProducts({
  components,
}: {
  components: LandingComponent[];
}) {
  const seen = new Set<number>();
  const discounted = components
    .filter((c) => c.type === "Product")
    .flatMap((c) => c.products)
    .filter((p) => p.discountPercent > 0 && p.finalPrice < p.totalPrice)
    .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
    .slice(0, 4);

  if (!discounted.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h2 className="text-[22px] font-extrabold text-ink">زرین‌آف</h2>
          <p className="mt-1 text-sm text-muted">تخفیف‌دارها</p>
        </div>
        <Link
          href="/categories"
          className="flex items-center gap-0.5 text-sm font-semibold text-teal-700"
        >
          مشاهده همه
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-[64px_repeat(4,1fr)] md:gap-5">
        <div className="hidden h-full min-h-[200px] w-16 flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-teal-600 to-teal-900 py-3.5 md:order-first md:flex">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-300">
            <span className="h-2 w-2 rounded-t-full border-2 border-b-0 border-teal-600" />
          </span>
          <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-bold tracking-wide text-gold-300">
            تخفیف‌های داغ
          </span>
        </div>
        {discounted.map((p) => (
          <LandingProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
