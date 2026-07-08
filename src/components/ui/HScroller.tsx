"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";

/**
 * Single-row horizontal scroller. Native touch swipe on mobile; left/right
 * arrow buttons on desktop scroll by ~80% of the visible width.
 *
 * `centerWhenFits`: when the content is narrower than the container, center
 * it instead of leaving it start-aligned. Only applied once measured to fit —
 * `justify-center` on an overflowing scroll container hides the start of the
 * content, so we never apply it while items overflow.
 */
export function HScroller({
  children,
  className = "",
  centerWhenFits = false,
}: {
  children: React.ReactNode;
  className?: string;
  centerWhenFits?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(false);

  useEffect(() => {
    if (!centerWhenFits) return;
    const el = ref.current;
    if (!el) return;
    const check = () => setFits(el.scrollWidth <= el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [centerWhenFits, children]);

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
        className={`no-scrollbar flex gap-4 overflow-x-auto scroll-smooth ${fits ? "justify-center" : ""} ${className}`}
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
