import Link from "next/link";
import { LandingProductCard } from "@/components/home/LandingProductCard";
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
        <Link href="/categories" className="text-sm font-semibold text-teal-700">
          مشاهده همه ‹
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5">
        <div className="hidden h-full min-h-[200px] flex-col items-center justify-center gap-3.5 rounded-2xl bg-gradient-to-b from-teal-600 to-teal-900 py-3.5 md:order-first md:flex">
          <span className="grid h-6.5 w-6.5 place-items-center rounded-full bg-gold-300">
            <span className="h-2.5 w-2.5 rounded-t-full border-2 border-b-0 border-teal-600" />
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
