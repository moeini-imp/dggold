"use client";

import { useRef, useState } from "react";
import type { LandingSliderImage } from "@/lib/shop/landing";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function Banner({ img, alt }: { img: LandingSliderImage; alt: string }) {
  const inner = img.imageUrl.startsWith("placeholder:") ? (
    <div className="grid h-full w-full place-items-center bg-gradient-to-l from-teal-800 via-teal-700 to-teal-600">
      <span className="text-2xl font-extrabold text-gold-200 md:text-4xl">
        دیجی گلد
      </span>
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

  // Taller banner (was 3/1 → md 4/1, which read short on wide screens).
  const cls =
    "block aspect-[2/1] w-full overflow-hidden rounded-hero bg-canvas md:aspect-[3/1]";

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

/**
 * Banner slider. Touch swipe uses native scroll-snap; desktop adds mouse-drag
 * to change slides (and suppresses the banner-link click after a drag). Dots
 * are clickable to jump. Container is RTL, so scrollLeft runs 0 → negative.
 */
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
    if (e.pointerType !== "mouse") return; // touch → native scroll handles it
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
    // RTL: drag left (dx < 0) → next banner; drag right → previous.
    if (Math.abs(dx) > 40) goTo(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory select-none overflow-x-auto md:cursor-grab md:active:cursor-grabbing"
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
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`رفتن به بنر ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-5 bg-teal-600" : "w-2 bg-line"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
