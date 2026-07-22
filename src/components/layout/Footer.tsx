import { Logo } from "@/components/ui/Logo";
import { ClockIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import { SITE_ADDRESS, SITE_HOURS, SITE_PHONE_DISPLAY } from "@/lib/site";
import { toPersianDigits } from "@/lib/format";

const trust = ["ضمانت اصالت", "معامله امن", "پشتیبانی سریع"];

export function Footer() {
  return (
    <footer className="hidden rounded-t-[24px] bg-gradient-to-br from-teal-900 to-teal-950 px-5 pb-8 pt-10 md:mt-10 md:block md:px-8 md:pt-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 border-b border-gold-300/15 pb-8 md:flex-row md:justify-between">
        {/* brand */}
        <div className="flex max-w-sm flex-col items-start gap-4">
          <Logo variant="dark" />
          <p className="text-[13px] leading-relaxed text-teal-100">
            پلتفرم خرید و فروش آنلاین طلا، سکه، شمش و مصنوعات از فروشندگان معتبر
            — با قیمت لحظه‌ای و تحویل فیزیکی همان روز.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {trust.map((t) => (
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
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-gold-300">اطلاعات تماس</h4>
          <div className="flex flex-col gap-3.5 text-sm text-surface">
            <div className="flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4 shrink-0 text-teal-200" />
              <span dir="ltr" className="tnum">
                {toPersianDigits(SITE_PHONE_DISPLAY)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ClockIcon className="h-4 w-4 shrink-0 text-teal-200" />
              <span>شنبه تا چهارشنبه، {toPersianDigits(SITE_HOURS)}</span>
            </div>
            <div className="flex max-w-xs items-start gap-2.5">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-200" />
              <span className="leading-relaxed">{SITE_ADDRESS}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-5">
        <span className="text-[13px] text-teal-200">
          © {toPersianDigits(1403)} تمامی حقوق این وب‌سایت برای دیجی گلد محفوظ
          است.
        </span>
      </div>
    </footer>
  );
}
