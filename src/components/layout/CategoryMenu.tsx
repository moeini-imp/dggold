"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft } from "@/components/ui/icons";
import type { CategoryTreeNode } from "@/lib/shop/category";

/** Rotating gradient swatches for categories without a real image. */
const FALLBACK_GRADIENTS = [
  "from-gold-200 to-gold-500",
  "from-teal-500 to-teal-800",
  "from-line to-muted",
  "from-gold-300 to-teal-600",
];

function CategoryIcon({ node, index }: { node: CategoryTreeNode; index: number }) {
  if (node.imageUrl && !node.imageUrl.startsWith("placeholder:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={node.imageUrl}
        alt={node.name}
        className="h-9 w-9 shrink-0 rounded-xl object-cover"
      />
    );
  }
  return (
    <span
      className={`h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br ${
        FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
      }`}
    />
  );
}

/**
 * One level of the category flyout. Hovering a row that has children opens a
 * sibling panel to its left (RTL) rendering this same component again for
 * that row's children — so the menu keeps drilling down (and the box keeps
 * stretching wider) to whatever depth the real category tree actually has.
 */
function CategoryLevel({
  nodes,
  onNavigate,
  heading,
}: {
  nodes: CategoryTreeNode[];
  onNavigate: () => void;
  heading?: string;
}) {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div
      className="w-80 rounded-[18px] border border-line bg-surface p-3 shadow-pop"
      onMouseLeave={() => setActiveId(null)}
    >
      {heading ? (
        <div className="px-3 pb-2.5 pt-1.5 text-xs font-bold text-gold-600">
          {heading}
        </div>
      ) : null}
      {nodes.map((node, i) => (
        <div
          key={node.id}
          className="relative"
          onMouseEnter={() => setActiveId(node.id)}
        >
          <Link
            href={`/category/${encodeURIComponent(node.name)}?cid=${node.id}`}
            onClick={onNavigate}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-canvas"
          >
            <CategoryIcon node={node} index={i} />
            <span className="flex-1 text-sm font-bold text-ink">{node.name}</span>
            {node.children.length ? (
              <ChevronLeft className="h-3.5 w-3.5 shrink-0 text-muted" />
            ) : null}
          </Link>

          {node.children.length && activeId === node.id ? (
            <div className="absolute right-full top-0 pr-2">
              <CategoryLevel nodes={node.children} onNavigate={onNavigate} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function CategoryMenu({ categories }: { categories: CategoryTreeNode[] }) {
  const [open, setOpen] = useState(false);
  if (!categories.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/categories"
        className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-ink"
      >
        <span>دسته‌بندی</span>
        <ChevronDown
          className="h-4 w-4 transition-transform duration-150"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        />
      </Link>

      {/* Inline-style-driven fade: guaranteed to apply regardless of any
          utility-class generation quirk, unlike Tailwind's opacity-* utilities. */}
      <div
        className="absolute right-0 top-full z-[60] pt-2"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 150ms ease",
        }}
      >
        <CategoryLevel
          nodes={categories}
          heading="دسته‌بندی محصولات"
          onNavigate={() => setOpen(false)}
        />
      </div>
    </div>
  );
}
