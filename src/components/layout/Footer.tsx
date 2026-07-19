import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SITE_ADDRESS, SITE_HOURS, SITE_PHONE_DISPLAY } from "@/lib/site";
import { toPersianDigits } from "@/lib/format";

const quickLinks = [
  { href: "/", label: "خرید و فروش" },
  { href: "/categories", label: "دسته‌بندی محصولات" },
  { href: "/contact", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
  { href: "/profile", label: "حساب کاربری" },
  { href: "/cart", label: "سبد خرید" },
  { href: "/profile/orders", label: "سفارش‌های من" },
  { href: "/login", label: "ورود / ثبت‌نام" },
];

export function Footer() {
  return (
    <footer className="mt-16 rounded-t-[28px] bg-gradient-to-br from-teal-900 to-teal-950 px-5 pb-24 pt-10 md:px-8 md:pb-8 md:pt-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 border-b border-gold-300/15 pb-10 md:grid-cols-3">
        {/* brand */}
        <div className="col-span-1 flex flex-col items-start gap-4">
          <Logo variant="dark" />
          <p className="max-w-[280px] text-[13px] leading-loose text-teal-100">
            پلتفرم خرید و فروش آنلاین طلا، سکه، شمش و مصنوعات از فروشندگان
            معتبر — با قیمت لحظه‌ای و تحویل فیزیکی همان روز.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {["ضمانت اصالت", "معامله امن", "پشتیبانی سریع"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-gold-300/30 px-3 py-1.5 text-[11px] text-gold-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* contact */}
        <div className="flex flex-col gap-5">
          <h4 className="border-b border-gold-300/25 pb-3 text-sm font-bold text-gold-300">
            اطلاعات تماس
          </h4>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-teal-200">تلفن تماس</p>
              <p dir="ltr" className="mt-1 text-sm font-medium text-surface tnum">
                {toPersianDigits(SITE_PHONE_DISPLAY)}
              </p>
            </div>
            <div>
              <p className="text-xs text-teal-200">ساعات کاری</p>
              <p className="mt-1 text-sm font-medium text-surface">
                شنبه تا چهارشنبه، {toPersianDigits(SITE_HOURS)}
              </p>
            </div>
            <div>
              <p className="text-xs text-teal-200">آدرس</p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-surface">
                {SITE_ADDRESS}
              </p>
            </div>
          </div>
        </div>

        {/* quick links */}
        <div className="flex flex-col gap-5">
          <h4 className="border-b border-gold-300/25 pb-3 text-sm font-bold text-gold-300">
            دسترسی سریع
          </h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {quickLinks.map((l, i) => (
              <Link
                key={`${l.href}-${i}`}
                href={l.href}
                className="text-[13px] text-teal-100 transition hover:text-gold-300"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 pt-7">
        <span className="text-[13px] text-teal-200">
          © {toPersianDigits(1403)} تمامی حقوق این وب‌سایت برای دیجی گلد محفوظ
          است.
        </span>
        <div className="flex gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              aria-hidden
              className="h-[52px] w-[52px] rounded-[10px] bg-surface/90"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
