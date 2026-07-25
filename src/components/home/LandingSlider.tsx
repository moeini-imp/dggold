"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { LandingSliderImage } from "@/lib/shop/landing";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function Banner({ img, alt }: { img: LandingSliderImage; alt: string }) {
  const inner = img.imageUrl.startsWith("placeholder:") ? (
    <div className="grid h-full w-full place-items-center bg-gradient-to-l from-teal-900 via-teal-800 to-teal-700 p-6 text-center">
      <div>
        <span className="text-2xl font-extrabold text-gold-300 md:text-3xl block">
          بازار آنلاین طلا و سکه دیجی گلد
        </span>
        <span className="text-xs text-teal-100 mt-2 block">
          خرید مستقیم با فاکتور رسمی و ضمانت تحویل فیزیکی
        </span>
      </div>
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.imageUrl}
      alt={alt}
      className="h-full w-full object-cover"
      draggable={false}
    />
  );

  const cls =
    "block aspect-[2.2/1] sm:aspect-[2.4/1] w-full overflow-hidden rounded-2xl bg-canvas shadow-xs h-full";

  if (!img.link) return <div className={cls}>{inner}</div>;
  if (isExternal(img.link)) {
    return (
      <a
        href={img.link}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        {inner}
      </a>
    );
  }
  return (
    <a href={img.link} className={cls}>
      {inner}
    </a>
  );
}

export function LandingSlider({ images }: { images: LandingSliderImage[] }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, moved: false });

  if (!images.length) return null;

  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: -clamped * el.clientWidth, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { active: true, startX: e.clientX, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    if (Math.abs(e.clientX - drag.current.startX) > 6) drag.current.moved = true;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 40) goTo(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 md:px-8 md:pt-6">
      <div className="grid gap-3.5 lg:grid-cols-[1fr_300px] lg:items-stretch">
        {/* Main Banner Slider */}
        <div className="relative min-w-0">
          <div
            ref={scrollRef}
            className="no-scrollbar flex snap-x snap-mandatory select-none overflow-x-auto lg:cursor-grab lg:active:cursor-grabbing rounded-2xl"
            onScroll={(e) => {
              const el = e.currentTarget;
              setActive(Math.round(el.scrollLeft / -el.clientWidth) || 0);
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={() => {
              drag.current.active = false;
            }}
            onClickCapture={(e) => {
              if (drag.current.moved) {
                e.preventDefault();
                e.stopPropagation();
                drag.current.moved = false;
              }
            }}
          >
            {images.map((img, i) => (
              <div key={i} className="w-full shrink-0 snap-center">
                <Banner img={img} alt={`بنر ${i + 1}`} />
              </div>
            ))}
          </div>

          {images.length > 1 ? (
            <div className="absolute bottom-3 inset-x-0 z-10 flex justify-center pointer-events-none">
              <div className="flex items-center gap-1.5 rounded-full bg-teal-950/60 px-3 py-1.5 backdrop-blur-md border border-white/10 pointer-events-auto">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`رفتن به بنر ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === active ? "w-5 bg-gold-400" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Side Promo Cards (Desktop Only - Height Justified with Slider) */}
        <div className="hidden lg:flex flex-col gap-3.5 h-full">
          <Link
            href="/wallet"
            className="group flex flex-1 min-h-0 flex-col justify-between rounded-2xl bg-gradient-to-br from-amber-500/15 via-gold-100/50 to-amber-500/20 p-4 border border-gold-300/60 shadow-xs transition hover:shadow-card hover:border-gold-400"
          >
            <div className="min-h-0">
              <span className="inline-flex rounded-md bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-teal-950">
                سرمایه‌گذاری
              </span>
              <h4 className="mt-2 text-xs xl:text-sm font-extrabold text-ink group-hover:text-teal-800 transition truncate">
                خرید و پس‌انداز آنلاین طلا
              </h4>
              <p className="mt-1 text-[11px] text-muted leading-tight line-clamp-2">
                شروع سرمایه‌گذاری طلا از ۵۰ هزار تومان بدون اجرت و مالیات
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] xl:text-xs font-bold text-teal-700">
              <span>ورود به کیف پول</span>
              <span className="text-sm transition-transform group-hover:-translate-x-1">←</span>
            </div>
          </Link>

          <Link
            href="/baloan/checkout"
            className="group flex flex-1 min-h-0 flex-col justify-between rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 p-4 border border-teal-800 text-surface shadow-xs transition hover:shadow-card hover:border-teal-600"
          >
            <div className="min-h-0">
              <span className="inline-flex rounded-md bg-teal-800 px-2 py-0.5 text-[10px] font-extrabold text-gold-300 border border-gold-300/30">
                اعتباری بالون
              </span>
              <h4 className="mt-2 text-xs xl:text-sm font-extrabold text-gold-200 group-hover:text-gold-300 transition truncate">
                خرید اقساطی طلا تا ۱۰،۰۰۰ سوت
              </h4>
              <p className="mt-1 text-[11px] text-teal-200/80 leading-tight line-clamp-2">
                بدون ضامن و با چک صیادی در اقساط ۱۲ ماهه
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] xl:text-xs font-bold text-gold-300">
              <span>دریافت اعتبار اقساطی</span>
              <span className="text-sm transition-transform group-hover:-translate-x-1">←</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
