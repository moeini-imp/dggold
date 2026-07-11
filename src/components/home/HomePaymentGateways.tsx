import { HScroller } from "@/components/ui/HScroller";
import type { PaymentGateway } from "@/lib/shop/payment";

/**
 * Homepage trust strip — payment gateway LOGOS only (no names/descriptions).
 * Replaces the old vendors strip.
 */
export function HomePaymentGateways({
  gateways,
}: {
  gateways: PaymentGateway[];
}) {
  const withLogo = gateways.filter((g) => g.imageUrl);
  if (!withLogo.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 md:px-8">
      <h2 className="mb-3 text-lg font-extrabold text-ink">درگاه‌های پرداخت</h2>
      <HScroller className="items-center pb-1" centerWhenFits>
        {withLogo.map((g) => (
          <span
            key={g.id}
            title={g.name}
            className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.imageUrl}
              alt={g.name}
              className="h-full w-full object-contain p-2"
            />
          </span>
        ))}
      </HScroller>
    </section>
  );
}
