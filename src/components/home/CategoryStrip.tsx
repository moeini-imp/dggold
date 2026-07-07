import Link from "next/link";
import type { Category } from "@/lib/types";

function CategoryIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 text-gold-500" fill="none">
      <rect
        x="9"
        y="20"
        width="30"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M14 20c0-4 4-7 10-7s10 3 10 7"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-8 md:gap-3 md:overflow-visible lg:grid-cols-12">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="flex shrink-0 flex-col items-center gap-2 text-center"
          >
            <span className="relative grid h-20 w-20 place-items-center rounded-2xl border border-gold-200 bg-surface shadow-sm transition group-hover:shadow-card">
              <CategoryIcon />
              {c.badge ? (
                <span className="absolute -top-2 right-1 rounded-md bg-gold-100 px-1.5 py-0.5 text-[10px] font-bold text-gold-600 tnum">
                  {c.badge}
                </span>
              ) : null}
            </span>
            <span className="w-20 text-xs font-medium leading-tight text-ink">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
