import Link from "next/link";
import { HScroller } from "@/components/ui/HScroller";
import type { ShopCategory } from "@/lib/shop/category";

function FallbackIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8 text-gold-500" fill="none">
      <rect x="9" y="20" width="30" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M14 20c0-4 4-7 10-7s10 3 10 7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Homepage category strip — a single row; scroll/arrows when it overflows. */
export function HomeCategories({ categories }: { categories: ShopCategory[] }) {
  if (!categories.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <HScroller className="pb-1" centerWhenFits>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${encodeURIComponent(c.name)}?cid=${c.id}`}
            className="flex shrink-0 flex-col items-center gap-2 text-center"
          >
            <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-gold-200 bg-surface shadow-sm">
              {c.imageUrl && !c.imageUrl.startsWith("placeholder:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <FallbackIcon />
              )}
            </span>
            <span className="w-20 text-xs font-medium leading-tight text-ink">
              {c.name}
            </span>
          </Link>
        ))}
      </HScroller>
    </section>
  );
}
