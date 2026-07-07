import Link from "next/link";
import { ChevronLeft } from "@/components/ui/icons";

/** Homepage hero banner — teal/gold treatment (replaces the live site's purple). */
export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
      <div className="relative overflow-hidden rounded-hero bg-gradient-to-l from-teal-800 via-teal-700 to-teal-600 px-6 py-10 md:px-12 md:py-16">
        {/* gold glow */}
        <div className="pointer-events-none absolute -left-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="relative max-w-lg">
          <p className="mb-2 text-sm font-medium text-gold-200">
            پلتفرم فروش نقدی طلا
          </p>
          <h1 className="text-3xl font-extrabold leading-snug text-surface md:text-4xl">
            شمش طلای ۱۸ و ۲۴ عیار
          </h1>
          <p className="mt-3 text-teal-100">
            خرید مطمئن طلا، سکه و شمش از فروشندگان معتبر با قیمت روز
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-1 rounded-btn bg-gold-400 px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-gold-300"
          >
            مشاهده محصولات
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
