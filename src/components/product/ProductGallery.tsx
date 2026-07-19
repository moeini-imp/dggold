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
    <div className="flex flex-col gap-3">
      <div className="grid h-[280px] place-items-center rounded-[20px] border border-line bg-surface p-9 md:h-[340px]">
        <ProductImage
          src={current}
          alt={alt}
          className="h-full w-full rounded-[14px]"
        />
      </div>

      {list.length > 1 ? (
        <div className="grid grid-cols-4 gap-2.5">
          {list.slice(0, 4).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`تصویر ${i + 1}`}
              aria-current={i === active}
              className={`h-16 overflow-hidden rounded-xl border-2 p-1.5 transition ${
                i === active
                  ? "border-teal-600"
                  : "border-line hover:border-teal-300"
              }`}
            >
              <ProductImage
                src={img}
                alt={`${alt} ${i + 1}`}
                className="h-full w-full rounded-lg bg-surface"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
