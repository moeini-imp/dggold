"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft } from "@/components/ui/icons";
import { toPersianDigits } from "@/lib/format";
import type { ShopCategory } from "@/lib/shop/category";

const VISIBLE_SUBS = 3;

function CategoryAvatar({ category }: { category: ShopCategory }) {
  if (category.imageUrl && !category.imageUrl.startsWith("placeholder:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={category.imageUrl}
        alt={category.name}
        className="h-full w-full object-contain p-1.5"
      />
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="h-6 w-6 text-gold-500" fill="none">
      <rect x="9" y="20" width="30" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M14 20c0-4 4-7 10-7s10 3 10 7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CategoryRow({ category }: { category: ShopCategory }) {
  return (
    <Link
      href={`/category/${encodeURIComponent(category.name)}?cid=${category.id}`}
      className="flex items-center gap-3 rounded-card border border-line bg-surface p-3 transition hover:border-teal-300"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-canvas">
        <CategoryAvatar category={category} />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
        {category.name}
      </span>
      <ChevronLeft className="h-4 w-4 shrink-0 text-muted" />
    </Link>
  );
}

/**
 * Vertical category tree: each parent is a section; up to 3 subcategories
 * are visible, the rest expand with "مشاهده بیشتر".
 */
export function CategoryTree({ categories }: { categories: ShopCategory[] }) {
  const groups = useMemo(() => {
    const byId = new Map(categories.map((c) => [c.id, c]));
    // A parent is a category whose id is referenced by others, or which has
    // no parent itself. Children keyed by parentId.
    const children = new Map<number, ShopCategory[]>();
    for (const c of categories) {
      if (c.parentId != null && byId.has(c.parentId) && c.parentId !== c.id) {
        const list = children.get(c.parentId) ?? [];
        list.push(c);
        children.set(c.parentId, list);
      }
    }
    const parents = categories.filter(
      (c) =>
        children.has(c.id) ||
        c.parentId == null ||
        !byId.has(c.parentId) ||
        c.parentId === c.id,
    );
    return parents.map((p) => ({ parent: p, subs: children.get(p.id) ?? [] }));
  }, [categories]);

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  if (!groups.length) {
    return (
      <p className="py-16 text-center text-muted">دسته‌بندی‌ای یافت نشد.</p>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map(({ parent, subs }) => {
        const isOpen = !!expanded[parent.id];
        const shown = isOpen ? subs : subs.slice(0, VISIBLE_SUBS);
        const hiddenCount = subs.length - VISIBLE_SUBS;

        return (
          <section key={parent.id}>
            {/* parent header */}
            <Link
              href={`/category/${encodeURIComponent(parent.name)}?cid=${parent.id}`}
              className="mb-3 flex items-center justify-between rounded-card bg-teal-700 px-4 py-3 text-surface transition hover:bg-teal-800"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface/10">
                  <CategoryAvatar category={parent} />
                </span>
                <span className="truncate font-extrabold">{parent.name}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-teal-100">
                مشاهده همه
                <ChevronLeft className="h-4 w-4" />
              </span>
            </Link>

            {/* subcategories */}
            {subs.length ? (
              <div className="space-y-2">
                {shown.map((s) => (
                  <CategoryRow key={s.id} category={s} />
                ))}

                {hiddenCount > 0 && !isOpen ? (
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((e) => ({ ...e, [parent.id]: true }))
                    }
                    className="flex w-full items-center justify-center gap-1 rounded-card border border-dashed border-line py-2.5 text-sm font-medium text-teal-700 transition hover:border-teal-300 hover:bg-teal-50"
                  >
                    مشاهده بیشتر ({toPersianDigits(hiddenCount)} دسته دیگر)
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ) : null}
                {isOpen && subs.length > VISIBLE_SUBS ? (
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((e) => ({ ...e, [parent.id]: false }))
                    }
                    className="flex w-full items-center justify-center gap-1 rounded-card border border-dashed border-line py-2.5 text-sm font-medium text-muted transition hover:border-teal-300"
                  >
                    بستن
                    <ChevronDown className="h-4 w-4 rotate-180" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
