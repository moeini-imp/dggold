import Link from "next/link";

/** Homepage hero banner — teal gradient panel with soft gold glow accents. */
export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-5 md:px-8">
      <div className="relative overflow-hidden rounded-hero bg-gradient-to-br from-teal-900 via-teal-800 to-teal-500 px-6 py-12 md:px-16 md:py-16">
        <div className="pointer-events-none absolute -top-16 -right-10 h-64 w-64 rounded-full bg-gold-300/35 blur-3xl md:h-72 md:w-72" />
        <div className="pointer-events-none absolute -bottom-10 left-6 h-28 w-28 rotate-[20deg] rounded-[28px] bg-gradient-to-br from-gold-500 to-gold-600 opacity-25" />
        <div className="pointer-events-none absolute top-14 left-40 hidden h-9 w-9 rounded-full bg-gradient-to-br from-gold-100 to-gold-500 opacity-70 md:block" />

        <div className="relative flex max-w-xl flex-col gap-5">
          <span className="inline-flex w-fit rounded-full bg-gold-300/15 px-3.5 py-1.5 text-[13px] font-semibold text-gold-300">
            پلتفرم خرید و فروش طلا و نقره
          </span>
          <h1 className="text-3xl font-extrabold leading-snug text-surface md:text-[44px]">
            دیجی گلد؛ مسیر ساده و امن سرمایه‌گذاری
          </h1>
          <p className="max-w-lg text-[15px] leading-8 text-teal-100 md:text-[17px]">
            با خرید اعتباری و اقساطی طلا، سکه و نقره در دیجی گلد، سرمایه‌گذاری
            خود را با اطمینان کامل آغاز کنید.
          </p>
          <div className="mt-2 flex flex-wrap gap-3.5">
            <Link
              href="#store"
              className="rounded-xl bg-gold-300 px-7 py-3.5 text-sm font-bold text-teal-950 transition hover:bg-gold-200"
            >
              شروع سرمایه‌گذاری
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-surface/25 px-7 py-3.5 text-sm font-semibold text-surface transition hover:bg-surface/10"
            >
              بیشتر بدانید
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
