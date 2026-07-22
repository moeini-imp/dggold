import { formatToman } from "@/lib/format";
import type { AssetPrice } from "@/lib/shop/assetPrice";

const CARDS: {
  symbol: number;
  label: string;
  sub: string;
  gradient: string;
  round?: boolean;
}[] = [
  { symbol: 3, label: "قیمت طلا", sub: "طلای آب‌شده", gradient: "from-gold-200 to-gold-500" },
  { symbol: 8, label: "قیمت نقره", sub: "هر گرم ۹۹۹.۹", gradient: "from-line to-muted", round: true },
  { symbol: 5, label: "قیمت سکه", sub: "سکه امامی", gradient: "from-gold-200 via-gold-100 to-gold-500", round: true },
];

/** Live gold/silver/coin price bar. Backend has no trend/% field, so no ▲/▼ pill. */
export function LivePriceBar({ prices }: { prices: AssetPrice[] }) {
  const byId = new Map(prices.map((p) => [p.symbol, p]));
  const cards = CARDS.map((c) => ({ ...c, price: byId.get(c.symbol) })).filter(
    (c) => c.price,
  );
  if (!cards.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-3 md:px-8 md:pt-5">
      {/* Compact 3-across on mobile (was 3 tall stacked cards eating the top of
          the page); full horizontal card with icon/sub on sm+. */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {cards.map((c) => (
          <div
            key={c.symbol}
            className="flex flex-col gap-1 rounded-card border border-line bg-surface px-2.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3.5 sm:px-5 sm:py-4"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className={`hidden h-9.5 w-9.5 shrink-0 bg-gradient-to-br sm:block ${c.gradient} ${
                  c.round ? "rounded-full" : "rounded-[11px]"
                }`}
              />
              <div className="flex flex-col">
                <span className="text-[11px] text-muted sm:text-[13px]">
                  {c.label}
                </span>
                <span className="hidden text-[11px] text-muted/70 sm:block">
                  {c.sub}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-ink tnum sm:text-[17px]">
              {formatToman(c.price!.price, false)}
              <span className="hidden font-normal text-muted sm:inline"> تومان</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
