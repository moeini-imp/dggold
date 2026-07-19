import { HScroller } from "@/components/ui/HScroller";
import type { PaymentGateway } from "@/lib/shop/payment";

/**
 * Homepage trust strip — payment gateway LOGOS only (no names/descriptions).
 * Always a single row of equal-size square tiles; scrolls horizontally once
 * there are more than fit the container instead of wrapping to a grid.
 */
export function HomePaymentGateways({
  gateways,
}: {
  gateways: PaymentGateway[];
}) {
  const withLogo = gateways.filter((g) => g.imageUrl);
  if (!withLogo.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h2 className="text-[20px] font-extrabold text-ink">
        همکاران پرداخت اقساطی
      </h2>
      <p className="mt-1 text-sm text-muted">
        خرید اقساطی طلا و سکه از درگاه‌های طرف‌قرارداد
      </p>
      <div className="mt-6">
        <HScroller centerWhenFits>
          {withLogo.map((g) => (
            <span
              key={g.id}
              title={g.name}
              className="grid aspect-square h-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-surface md:h-24"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.imageUrl}
                alt={g.name}
                className="h-full w-full object-contain p-3"
              />
            </span>
          ))}
        </HScroller>
      </div>
    </section>
  );
}
