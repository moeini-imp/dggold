"use client";

import { HScroller } from "@/components/ui/HScroller";
import type { PaymentGateway } from "@/lib/shop/payment";

export function HomePaymentGateways({
  gateways,
}: {
  gateways: PaymentGateway[];
}) {
  const list = gateways.length ? gateways : [];
  if (!list.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-700 border border-teal-100 mb-2">
            بیش از ۱۰ شریک اعتباری
          </span>
          <h2 className="text-xl font-extrabold text-ink md:text-2xl">
            شرکای پرداخت اعتباری و اقساطی
          </h2>
          <p className="mt-1 text-xs text-muted md:text-sm">
            امکان خرید اقساطی طلا و سکه با بیش از ۱۰ درگاه و سازمان طرف‌قرارداد
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs md:p-6">
        <HScroller centerWhenFits>
          {list.map((g) => (
            <div
              key={g.id || g.code || g.name}
              title={g.description || g.name}
              className="flex flex-col items-center justify-between gap-2.5 rounded-xl border border-line/80 bg-canvas/60 p-3.5 transition hover:border-teal-300 hover:bg-surface hover:shadow-card w-36 md:w-40 shrink-0"
            >
              <div className="grid aspect-square h-12 w-12 place-items-center overflow-hidden rounded-xl border border-line bg-white text-teal-900/40 font-extrabold text-base shadow-xs">
                {g.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.imageUrl}
                    alt={g.name}
                    className="h-full w-full object-contain p-1 rounded-xl"
                  />
                ) : (
                  <span>💳</span>
                )}
              </div>

              <div className="text-center w-full">
                <p className="truncate text-xs font-bold text-ink">{g.name}</p>
                <p className="mt-0.5 text-[10px] text-muted truncate">
                  {g.isCredit ? "خرید اقساطی" : "درگاه مستقیم"}
                </p>
              </div>
            </div>
          ))}
        </HScroller>
      </div>
    </section>
  );
}
