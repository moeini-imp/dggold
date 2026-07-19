"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "@/components/ui/icons";
import type { CategoryTreeNode } from "@/lib/shop/category";

/** Rotating gradient swatches for categories without a real image. */
const FALLBACK_GRADIENTS = [
  "from-gold-200 to-gold-500",
  "from-teal-500 to-teal-800",
  "from-line to-muted",
  "from-gold-300 to-teal-600",
];

export function CategoryMenu({ categories }: { categories: CategoryTreeNode[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // `categories` is already the tree's top-level (root) nodes.
  const topLevel = categories;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!topLevel.length) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-semibold text-ink"
      >
        <span>دسته‌بندی</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="absolute top-9 right-0 z-[60] w-80 rounded-[18px] border border-line bg-surface p-3 shadow-pop">
          <div className="px-3 pb-2.5 pt-1.5 text-xs font-bold text-gold-600">
            دسته‌بندی محصولات
          </div>
          {topLevel.map((c, i) => (
            <Link
              key={c.id}
              href={`/category/${encodeURIComponent(c.name)}?cid=${c.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-canvas"
            >
              {c.imageUrl && !c.imageUrl.startsWith("placeholder:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="h-9 w-9 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <span
                  className={`h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br ${
                    FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]
                  }`}
                />
              )}
              <span className="text-sm font-bold text-ink">{c.name}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
