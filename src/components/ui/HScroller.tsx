"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";

/**
 * Single-row horizontal scroller. Native touch swipe on mobile; left/right
 * arrow buttons on desktop scroll by ~80% of the visible width.
 */
export function HScroller({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* right arrow (desktop) */}
      <button
        type="button"
        aria-label="بعدی"
        onClick={() => scrollBy(1)}
        className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-card transition hover:text-teal-700 md:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={ref}
        className={`no-scrollbar flex gap-4 overflow-x-auto scroll-smooth ${className}`}
      >
        {children}
      </div>

      {/* left arrow (desktop) */}
      <button
        type="button"
        aria-label="قبلی"
        onClick={() => scrollBy(-1)}
        className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-card transition hover:text-teal-700 md:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  );
}
