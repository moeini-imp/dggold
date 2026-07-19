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
    <section className="mx-auto max-w-7xl px-4 pt-5 md:px-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.symbol}
            className="flex items-center justify-between gap-3.5 rounded-card border border-line bg-surface px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-9.5 w-9.5 shrink-0 bg-gradient-to-br ${c.gradient} ${
                  c.round ? "rounded-full" : "rounded-[11px]"
                }`}
              />
              <div className="flex flex-col">
                <span className="text-[13px] text-muted">{c.label}</span>
                <span className="text-[11px] text-muted/70">{c.sub}</span>
              </div>
            </div>
            <span className="text-[17px] font-extrabold text-ink tnum">
              {formatToman(c.price!.price)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
