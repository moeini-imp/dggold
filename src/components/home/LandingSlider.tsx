"use client";

import { useState } from "react";
import type { LandingSliderImage } from "@/lib/shop/landing";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function Banner({ img, alt }: { img: LandingSliderImage; alt: string }) {
  const inner = img.imageUrl.startsWith("placeholder:") ? (
    <div className="grid h-full w-full place-items-center bg-gradient-to-l from-teal-800 via-teal-700 to-teal-600">
      <span className="text-lg font-extrabold text-gold-200">دیجی گلد</span>
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={img.imageUrl} alt={alt} className="h-full w-full object-cover" />
  );

  const cls =
    "block aspect-[3/1] w-full overflow-hidden rounded-hero bg-canvas md:aspect-[4/1]";

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

/** Banner slider. Horizontal snap; dots to jump. Each banner links out. */
export function LandingSlider({ images }: { images: LandingSliderImage[] }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
      <div
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / -el.clientWidth) || 0);
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
            <span
              key={i}
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
