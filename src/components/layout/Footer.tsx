"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ClockIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import { SITE_ADDRESS, SITE_HOURS, SITE_PHONE_DISPLAY } from "@/lib/site";
import { toPersianDigits } from "@/lib/format";

const trustBadges = [
  { icon: "🛡️", title: "ضمانت ۱۰۰٪ اصالت", desc: "همراه با فاکتور رسمی اتحادیه طلا" },
  { icon: "🚚", title: "ارسال بیمه‌شده", desc: "تحویل فیزیکی امن در سراسر کشور" },
  { icon: "💳", title: "خرید اعتباری و اقساطی", desc: "بیش از ۱۰ شریک و درگاه اعتباری" },
  { icon: "⚖️", title: "معامله شفاف طلا", desc: "محاسبه دقیق اجرت و سود بر اساس نرخ زنده" },
];

export function Footer() {
  return (
    <footer className="hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950 text-surface md:block border-t border-gold-300/20">
      {/* Trust Values Strip */}
      <div className="border-b border-gold-300/15 bg-teal-950/80 py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-6 px-8">
          {trustBadges.map((b) => (
            <div key={b.title} className="flex items-center gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-400/10 text-xl text-gold-300 border border-gold-400/20 shadow-xs">
                {b.icon}
              </span>
              <div>
                <h4 className="text-xs font-bold text-gold-200">{b.title}</h4>
                <p className="text-[11px] text-teal-200/80 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-10 px-8 py-12">
        {/* Brand story */}
        <div className="flex flex-col gap-4">
          <Logo variant="dark" />
          <p className="text-xs leading-relaxed text-teal-200/90">
            دیجی گلد؛ پلتفرم تخصصی خرید و فروش آنلاین طلا، سکه و شمش با قیمت لحظه‌ای و شفافیت کامل. امکان خرید اقساطی با بیش از ۱۰ شریک اعتباری و دریافت فیزیکی طلا.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="rounded-lg bg-teal-900/90 border border-gold-300/20 px-3 py-1.5 text-[11px] font-bold text-gold-300">
              مجوز اتحادیه طلا و جواهر
            </span>
            <span className="rounded-lg bg-teal-900/90 border border-gold-300/20 px-3 py-1.5 text-[11px] font-bold text-gold-300">
              نماد اعتماد الکترونیکی
            </span>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-extrabold text-gold-300 uppercase tracking-wider">دسترسی سریع</h4>
          <ul className="space-y-2.5 text-xs text-teal-200/80">
            <li>
              <Link href="/categories" className="hover:text-gold-200 transition">
                دسته‌بندی محصولات
              </Link>
            </li>
            <li>
              <Link href="/wallet" className="hover:text-gold-200 transition">
                کیف پول طلا
              </Link>
            </li>
            <li>
              <Link href="/baloan/checkout" className="hover:text-gold-200 transition">
                راهنمای خرید اقساطی
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-200 transition">
                تماس با پشتیبانی
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-extrabold text-gold-300 uppercase tracking-wider">محصولات محبوب</h4>
          <ul className="space-y-2.5 text-xs text-teal-200/80">
            <li>
              <Link href="/category/طلا" className="hover:text-gold-200 transition">
                طلای ۱۸ عیار و آب‌شده
              </Link>
            </li>
            <li>
              <Link href="/category/سکه" className="hover:text-gold-200 transition">
                سکه امامی و بهار آزادی
              </Link>
            </li>
            <li>
              <Link href="/category/دستبند" className="hover:text-gold-200 transition">
                دستبند و زنجیر طلا
              </Link>
            </li>
            <li>
              <Link href="/category/شمش" className="hover:text-gold-200 transition">
                شمش‌های کادویی و سرمایه‌گذاری
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-xs font-extrabold text-gold-300 uppercase tracking-wider">ارتباط و پشتیبانی</h4>
          <div className="space-y-3 text-xs text-teal-100">
            <div className="flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4 text-gold-400 shrink-0" />
              <span dir="ltr" className="tnum font-bold">
                {toPersianDigits(SITE_PHONE_DISPLAY)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ClockIcon className="h-4 w-4 text-gold-400 shrink-0" />
              <span>پاسخگویی: {toPersianDigits(SITE_HOURS)}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <PinIcon className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{SITE_ADDRESS}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gold-300/10 py-4 text-center text-[11px] text-teal-300/60">
        © {toPersianDigits(1403)} تمامی حقوق مادی و معنوی این وب‌سایت متعلق به دیجی گلد می‌باشد.
      </div>
    </footer>
  );
}
