"use client";

import { useEffect, useState } from "react";
import { formatToman } from "@/lib/format";
import type { AssetPrice } from "@/lib/shop/assetPrice";

const ITEMS = [
  { symbol: 3, label: "طلای آب‌شده", sub: "هر گرم ۱۸ عیار", color: "bg-amber-400" },
  { symbol: 5, label: "سکه امامی", sub: "طرح جدید", color: "bg-gold-500" },
  { symbol: 8, label: "نقره ۹۹۹", sub: "هر گرم", color: "bg-slate-300" },
];

export function LivePriceBar({ prices: initialPrices }: { prices: AssetPrice[] }) {
  const [prices, setPrices] = useState(initialPrices);

  // Refresh live prices every minute without a page reload. Skips while the tab
  // is hidden and fetches once on becoming visible again.
  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/asset-prices", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as { data?: AssetPrice[] };
        if (!cancelled && Array.isArray(json.data) && json.data.length) {
          setPrices(json.data);
        }
      } catch {
        // transient network error — keep showing the last known prices
      }
    };

    const id = window.setInterval(refresh, 60_000);
    const onVisible = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const byId = new Map(prices.map((p) => [p.symbol, p]));
  const cards = ITEMS.map((c) => ({ ...c, price: byId.get(c.symbol) })).filter(
    (c) => c.price,
  );

  return (
    <section className="bg-gradient-to-r from-teal-950 via-teal-900 to-teal-950 text-surface shadow-xs border-b border-gold-300/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs md:px-8">
        {/* Live indicator + prices ticker */}
        <div className="flex w-full items-center justify-between gap-3 md:gap-6 min-w-0 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-teal-800/80 px-2.5 py-1 text-[11px] font-medium text-gold-300 border border-gold-300/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>قیمت زنده بازار طلا و سکه</span>
          </div>

          <div className="flex items-center gap-5 md:gap-10 shrink-0">
            {cards.map((c) => (
              <div key={c.symbol} className="flex items-center gap-2 whitespace-nowrap">
                <span className={`h-2 w-2 rounded-full ${c.color}`} />
                <span className="text-teal-200/90 font-medium">{c.label}:</span>
                <span className="font-extrabold text-gold-200 tnum">
                  {formatToman(c.price!.price, false)}
                  <span className="text-[10px] font-normal text-teal-300/80 ms-1">تومان</span>
                </span>
              </div>
            ))}
          </div>

          <div className="hidden lg:block text-[11px] text-teal-300/80 font-medium">
            بروزرسانی لحظه‌ای از اتحادیه طلا
          </div>
        </div>
      </div>
    </section>
  );
}
