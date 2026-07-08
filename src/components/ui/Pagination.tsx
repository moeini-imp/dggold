import Link from "next/link";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { toPersianDigits } from "@/lib/format";

/** Builds up to 5 page numbers centered on the current page. */
function pageWindow(current: number, total: number): number[] {
  const size = Math.min(5, total);
  let start = Math.max(1, current - Math.floor(size / 2));
  const end = Math.min(total, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/** Numbered pagination. RTL: "قبلی"/next chevrons point the natural direction. */
export function Pagination({
  currentPage,
  totalPages,
  makeHref,
}: {
  currentPage: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(currentPage, totalPages);

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      <Link
        href={makeHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage <= 1}
        className={`grid h-9 w-9 place-items-center rounded-btn border border-line transition ${
          currentPage <= 1
            ? "pointer-events-none opacity-40"
            : "hover:border-teal-300 hover:text-teal-700"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>

      {pages[0] > 1 ? (
        <>
          <Link
            href={makeHref(1)}
            className="grid h-9 w-9 place-items-center rounded-btn border border-line text-sm tnum transition hover:border-teal-300 hover:text-teal-700"
          >
            {toPersianDigits(1)}
          </Link>
          {pages[0] > 2 ? <span className="px-1 text-muted">…</span> : null}
        </>
      ) : null}

      {pages.map((p) => (
        <Link
          key={p}
          href={makeHref(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={`grid h-9 w-9 place-items-center rounded-btn border text-sm font-medium tnum transition ${
            p === currentPage
              ? "border-teal-600 bg-teal-600 text-surface"
              : "border-line hover:border-teal-300 hover:text-teal-700"
          }`}
        >
          {toPersianDigits(p)}
        </Link>
      ))}

      {pages[pages.length - 1] < totalPages ? (
        <>
          {pages[pages.length - 1] < totalPages - 1 ? (
            <span className="px-1 text-muted">…</span>
          ) : null}
          <Link
            href={makeHref(totalPages)}
            className="grid h-9 w-9 place-items-center rounded-btn border border-line text-sm tnum transition hover:border-teal-300 hover:text-teal-700"
          >
            {toPersianDigits(totalPages)}
          </Link>
        </>
      ) : null}

      <Link
        href={makeHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage >= totalPages}
        className={`grid h-9 w-9 place-items-center rounded-btn border border-line transition ${
          currentPage >= totalPages
            ? "pointer-events-none opacity-40"
            : "hover:border-teal-300 hover:text-teal-700"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
    </nav>
  );
}
