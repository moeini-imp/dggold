import Link from "next/link";
import { HScroller } from "@/components/ui/HScroller";
import type { CategoryTreeNode } from "@/lib/shop/category";

function FallbackIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8 text-gold-500" fill="none">
      <rect x="9" y="20" width="30" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M14 20c0-4 4-7 10-7s10 3 10 7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Homepage category icon row — the first-level children of the category tree
 *  (not the root/parent nodes), 92×92 tiles; centered when they fit, scrolls
 *  once there are more. Falls back to the roots if none have children. */
export function HomeCategories({ categories }: { categories: CategoryTreeNode[] }) {
  const children = categories.flatMap((c) => c.children);
  const items = children.length ? children : categories;
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-7 md:px-8">
      <HScroller className="pb-1" centerWhenFits>
        {items.map((c) => (
          <Link
            key={c.id}
            href={`/category/${encodeURIComponent(c.name)}?cid=${c.id}`}
            className="flex w-[104px] shrink-0 flex-col items-center gap-3 text-center"
          >
            <span className="grid h-[92px] w-[92px] place-items-center overflow-hidden rounded-[20px] border border-line bg-surface shadow-card">
              {c.imageUrl && !c.imageUrl.startsWith("placeholder:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FallbackIcon />
              )}
            </span>
            <span className="w-full truncate text-[13px] font-semibold text-ink">
              {c.name}
            </span>
          </Link>
        ))}
      </HScroller>
    </section>
  );
}
