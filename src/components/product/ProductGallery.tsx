"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";

/** Enhanced Product Gallery with badge overlays, zoom preview, and thumb selection */
export function ProductGallery({
  images,
  alt,
  karat,
  weight,
}: {
  images: string[];
  alt: string;
  karat?: number;
  weight?: number;
}) {
  const [active, setActive] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const list = images.length ? images : [];
  const current = list[active] ?? list[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Container */}
      <div className="relative group overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-sm transition hover:shadow-card md:p-8">
        {/* Badges Overlay */}
        <div className="absolute start-3 top-3 z-10 flex flex-wrap gap-1.5">
          {karat ? (
            <span className="rounded-lg bg-teal-900/90 text-gold-300 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm shadow-xs">
              {karat} عیار
            </span>
          ) : null}
          {weight ? (
            <span className="rounded-lg bg-gold-100 text-gold-700 px-2.5 py-1 text-[11px] font-bold shadow-xs">
              {weight} گرم
            </span>
          ) : null}
        </div>

        {/* Zoom trigger */}
        <button
          type="button"
          onClick={() => setShowZoom(true)}
          className="absolute end-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg bg-surface/80 text-ink/70 opacity-0 transition group-hover:opacity-100 hover:bg-surface hover:text-ink shadow-xs"
          title="بزرگ‌نمایی تصویر"
        >
          🔍
        </button>

        <div className="aspect-square w-full grid place-items-center">
          <ProductImage
            src={current}
            alt={alt}
            className="h-full w-full object-contain rounded-xl transition duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Thumbnails list */}
      {list.length > 1 ? (
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`تصویر ${i + 1}`}
              aria-current={i === active}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 p-1 transition ${
                i === active
                  ? "border-teal-600 bg-teal-50/50 shadow-xs scale-105"
                  : "border-line bg-surface hover:border-teal-300 opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage
                src={img}
                alt={`${alt} ${i + 1}`}
                className="h-full w-full object-contain rounded-lg"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Fullscreen Zoom Modal */}
      {showZoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative max-w-2xl w-full p-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowZoom(false)}
              className="absolute -top-10 end-2 text-white text-xl font-bold hover:text-gold-300"
            >
              ✕ بستن
            </button>
            <div className="bg-surface rounded-2xl p-6 shadow-pop border border-line">
              <ProductImage
                src={current}
                alt={alt}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
