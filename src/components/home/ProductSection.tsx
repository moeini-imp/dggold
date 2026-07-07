import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronLeft } from "@/components/ui/icons";
import type { Category, ProductListItem } from "@/lib/types";

export function ProductSection({
  category,
  products,
}: {
  category: Category;
  products: ProductListItem[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 md:px-6">
      {/* teal title bar */}
      <div className="flex items-center justify-between rounded-card bg-teal-700 px-4 py-3 text-surface md:px-6">
        <h2 className="text-lg font-extrabold md:text-xl">{category.name}</h2>
        <Link
          href={`/categories/${category.slug}`}
          className="flex items-center gap-1 rounded-btn bg-teal-800/60 px-3 py-1.5 text-sm font-medium transition hover:bg-teal-800"
        >
          مشاهده بیشتر
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      {/* horizontal carousel */}
      <div className="no-scrollbar mt-4 flex snap-x gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[44%] shrink-0 snap-start sm:w-[260px] md:w-[240px]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
