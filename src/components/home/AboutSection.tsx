"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "@/components/ui/icons";

const bullets = [
  "خرید طلای آب‌شده با کمترین کارمزد برای سرمایه‌گذاری",
  "خرید سکه پارسیان برای هدیه و پس‌انداز خرد",
  "خرید سکه بانکی (بهار آزادی و امامی)",
  "خرید نقره برای سرمایه‌گذاری کم‌ریسک",
];

const trust = [
  { label: "بیش از یک دهه سابقه در بازار طلا", tone: "bg-teal-600" },
  { label: "ضمانت اصالت کالا و فاکتور رسمی", tone: "bg-gold-500" },
  { label: "تحویل فیزیکی در همان روز", tone: "bg-ink rounded-xl" },
];

export function AboutSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-4 py-9 md:px-8">
      <div className="rounded-[24px] border border-line bg-surface p-6 md:p-12">
        <p className="max-w-[900px] text-[15px] leading-8 text-ink/80 md:text-base">
          <strong className="text-ink">دیجی گلد</strong> خرید آنلاین و اقساطی
          طلا و سکه را با قیمت لحظه‌ای، تضمین اصالت و فاکتور رسمی از فروشندگان
          معتبر فراهم کرده است. شما می‌توانید همین حالا تحویل بگیرید و هزینه را
          به‌صورت <strong className="text-ink">اعتباری و قسطی</strong> از
          طریق درگاه‌های معتبر در چند قسط بپردازید.
        </p>
        {expanded ? (
          <p className="mt-6 max-w-[900px] text-[15px] leading-8 text-ink/80 md:text-base">
            تمامی معاملات با فاکتور رسمی و ضمانت اصالت کالا انجام می‌شود و تیم
            پشتیبانی دیجی گلد در تمام مراحل خرید همراه شماست.
          </p>
        ) : null}

        <div className="mt-7 grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-ink">
              چه چیزهایی را اقساطی بخریم؟
            </h3>
            <div className="flex flex-col gap-3">
              {bullets.map((b) => (
                <div key={b} className="flex items-start gap-2.5 text-[15px] text-ink/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
            <Link
              href="#prices"
              className="mt-4 inline-block text-sm font-semibold text-teal-700"
            >
              قیمت لحظه‌ای طلا و سکه ‹
            </Link>
          </div>
          <div className="flex flex-col gap-5 rounded-2xl bg-canvas p-7">
            {trust.map((t) => (
              <div key={t.label} className="flex items-center gap-3.5">
                <span className={`h-10 w-10 shrink-0 rounded-full ${t.tone}`} />
                <span className="text-[15px] font-semibold text-ink">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
          >
            <span>{expanded ? "بستن توضیحات" : "مشاهده بیشتر توضیحات"}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
