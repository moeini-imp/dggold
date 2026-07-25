"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft } from "@/components/ui/icons";
import type { CategoryTreeNode } from "@/lib/shop/category";

/** Rotating gradient swatches for root categories without an image. */
const FALLBACK_GRADIENTS = [
  "from-gold-300 to-gold-600 text-teal-950",
  "from-teal-600 to-teal-900 text-gold-300",
  "from-amber-500 to-gold-400 text-teal-950",
  "from-teal-800 to-slate-900 text-gold-200",
];

export function CategoryMenu({ categories }: { categories: CategoryTreeNode[] }) {
  const [open, setOpen] = useState(false);
  const [activeL1Id, setActiveL1Id] = useState<number | null>(
    categories[0]?.id ?? null,
  );

  if (!categories.length) return null;

  const activeL1 =
    categories.find((c) => c.id === activeL1Id) || categories[0];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger Link */}
      <Link
        href="/categories"
        className="flex cursor-pointer items-center gap-1.5 text-sm font-bold text-ink hover:text-teal-700 transition"
      >
        <span>دسته‌بندی محصولات</span>
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        />
      </Link>

      {/* 3-Layer Mega Menu Container */}
      <div
        className="absolute right-0 top-full z-[60] pt-2"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 150ms ease, transform 150ms ease",
          transform: open ? "translateY(0)" : "translateY(4px)",
        }}
      >
        <div className="flex w-[760px] max-w-[calc(100vw-2rem)] min-h-[380px] rounded-[22px] border border-line bg-surface shadow-2xl overflow-hidden">
          {/* Layer 1 Sidebar (Right) */}
          <div className="w-56 shrink-0 border-l border-line/80 bg-canvas/60 p-2.5 space-y-1">
            <div className="px-3 py-2 text-[11px] font-extrabold text-muted uppercase tracking-wider">
              دسته‌بندی‌های اصلی
            </div>
            {categories.map((l1, index) => {
              const isActive = l1.id === activeL1.id;
              return (
                <button
                  key={l1.id}
                  type="button"
                  onMouseEnter={() => setActiveL1Id(l1.id)}
                  onClick={() => setActiveL1Id(l1.id)}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                    isActive
                      ? "bg-surface text-teal-800 shadow-xs border border-line/60"
                      : "text-ink/80 hover:bg-surface/60 hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {l1.imageUrl && !l1.imageUrl.startsWith("placeholder:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={l1.imageUrl}
                        alt={l1.name}
                        className="h-7 w-7 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${
                          FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
                        } text-xs font-extrabold shadow-xs`}
                      >
                        {l1.name.charAt(0)}
                      </span>
                    )}
                    <span className="truncate">{l1.name}</span>
                  </div>
                  <ChevronLeft
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isActive ? "text-teal-600 -translate-x-0.5" : "text-muted"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Main Area: Layer 2 Groups & Layer 3 Items */}
          <div className="flex-1 p-5 overflow-y-auto max-h-[440px] space-y-5">
            {/* Header / Direct All Link */}
            <div className="flex items-center justify-between border-b border-line pb-3">
              <Link
                href={`/category/${encodeURIComponent(activeL1.name)}?cid=${activeL1.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 text-xs font-extrabold text-teal-700 hover:text-teal-900 transition"
              >
                <span>همه محصولات {activeL1.name}</span>
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <span className="text-[11px] text-muted">
                {activeL1.children.length} دسته فرعی
              </span>
            </div>

            {/* Subcategories Grid (Layer 2 & Layer 3) */}
            {activeL1.children.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {activeL1.children.map((l2) => {
                  const hasL3 = l2.children.length > 0;

                  return (
                    <div key={l2.id} className="space-y-2">
                      {/* Layer 2 Header */}
                      <Link
                        href={`/category/${encodeURIComponent(l2.name)}?cid=${l2.id}`}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-1 text-xs font-extrabold text-ink hover:text-teal-700 transition"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-600 group-hover:scale-125 transition-transform" />
                        <span>{l2.name}</span>
                        <ChevronLeft className="h-3 w-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      {/* Layer 3 Items List */}
                      {hasL3 ? (
                        <div className="flex flex-col space-y-1.5 ps-3 border-r-2 border-line/60">
                          {l2.children.map((l3) => (
                            <Link
                              key={l3.id}
                              href={`/category/${encodeURIComponent(l3.name)}?cid=${l3.id}`}
                              onClick={() => setOpen(false)}
                              className="text-[11px] font-medium text-muted hover:text-teal-700 hover:font-bold transition truncate"
                            >
                              {l3.name}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-muted">
                <span>محصولات در این دسته‌بندی قرار دارند</span>
                <Link
                  href={`/category/${encodeURIComponent(activeL1.name)}?cid=${activeL1.id}`}
                  onClick={() => setOpen(false)}
                  className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-gold-300 transition hover:bg-teal-700"
                >
                  مشاهده همه
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
