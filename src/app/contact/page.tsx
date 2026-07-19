import type { Metadata } from "next";
import { ClockIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import { toPersianDigits } from "@/lib/format";
import { SITE_ADDRESS, SITE_HOURS, SITE_PHONE, SITE_PHONE_DISPLAY } from "@/lib/site";

export const metadata: Metadata = {
  title: "تماس با ما | دیجی گلد",
};

// 35°40'42.5"N 51°24'56.6"E
const LAT = 35.678472;
const LNG = 51.415722;
const MAP_QUERY = `${LAT},${LNG}`;

const PHONE = SITE_PHONE;
const ADDRESS = SITE_ADDRESS;
const HOURS = SITE_HOURS;

const INTRO =
  "ما متعهد هستیم بهترین خدمات را با بالاترین کیفیت به شما ارائه دهیم و همواره آماده‌ایم تا به سوالات، نیازها و نظرات شما با دقت و احترام پاسخ دهیم. اگر به راهنمایی یا اطلاعات بیشتری نیاز دارید، تیم پشتیبانی ما همواره در کنار شماست. تیم ما با افتخار در کوتاه‌ترین زمان ممکن به پیام‌ها و تماس‌های شما پاسخ می‌دهد تا اطمینان حاصل شود که تجربه‌ای رضایت‌بخش و حرفه‌ای از ارتباط با ما داشته باشید.";

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 rounded-card bg-surface p-4 shadow-card">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p dir="auto" className="font-medium leading-relaxed text-ink tnum">
          {value}
        </p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block transition hover:opacity-90">
      {content}
    </a>
  ) : (
    content
  );
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
      <h1 className="mb-5 text-xl font-extrabold text-ink md:text-2xl">
        تماس با ما
      </h1>

      <p className="mb-6 rounded-card bg-surface p-5 text-sm leading-loose text-ink/80 shadow-card">
        {INTRO}
      </p>

      <div className="space-y-3">
        <InfoRow
          icon={<PhoneIcon className="h-5 w-5" />}
          label="تماس تلفنی"
          value={toPersianDigits(SITE_PHONE_DISPLAY)}
          href={`tel:${PHONE}`}
        />
        <InfoRow
          icon={<PinIcon className="h-5 w-5" />}
          label="آدرس"
          value={ADDRESS}
        />
        <InfoRow
          icon={<ClockIcon className="h-5 w-5" />}
          label="ساعات پاسخگویی"
          value={HOURS}
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-card shadow-card">
        <iframe
          title="موقعیت دیجی گلد روی نقشه"
          src={`https://www.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`}
          className="h-72 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={`https://www.google.com/maps?q=${MAP_QUERY}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-teal-700 hover:underline"
      >
        مشاهده در Google Maps
      </a>
    </div>
  );
}
