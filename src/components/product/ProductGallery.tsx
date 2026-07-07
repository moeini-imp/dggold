"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";

/** Product gallery: large main image + selectable thumbnails. */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];
  const current = list[active] ?? list[0];

  return (
    <div>
      <ProductImage
        src={current}
        alt={alt}
        className="aspect-square w-full rounded-card bg-surface shadow-card"
      />

      {list.length > 1 ? (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`تصویر ${i + 1}`}
              aria-current={i === active}
              className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === active
                  ? "border-teal-600"
                  : "border-line hover:border-teal-300"
              }`}
            >
              <ProductImage
                src={img}
                alt={`${alt} ${i + 1}`}
                className="h-16 w-16 bg-surface"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
