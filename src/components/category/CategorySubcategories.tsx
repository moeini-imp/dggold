import Link from "next/link";
import type { CategoryTreeNode } from "@/lib/shop/category";

/**
 * Subcategory chip row shown at the top of a category's product list — same
 * visual language as the vendor minisite's category chips. "همه" (active)
 * points back at the current category; each other chip navigates to a child.
 */
export function CategorySubcategories({
  items,
  currentName,
  currentId,
}: {
  items: CategoryTreeNode[];
  currentName: string;
  currentId: number | null;
}) {
  if (!items.length) return null;

  return (
    <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
      <Chip
        href={`/category/${encodeURIComponent(currentName)}?cid=${currentId ?? ""}`}
        label="همه"
        active
      />
      {items.map((c) => (
        <Chip
          key={c.id}
          href={`/category/${encodeURIComponent(c.name)}?cid=${c.id}`}
          label={c.name}
          active={false}
        />
      ))}
    </div>
  );
}

function Chip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-teal-600 bg-teal-600 text-surface"
          : "border-line bg-surface text-ink hover:border-teal-300"
      }`}
    >
      {label}
    </Link>
  );
}
