import { ProductCard } from "@/components/product/ProductCard";
import type { ProductListItem } from "@/lib/types";

/** "محصولات مرتبط" box on the PDP — horizontal carousel of related items. */
export function RelatedProducts({
  products,
}: {
  products: ProductListItem[];
}) {
  if (!products.length) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-extrabold text-ink">محصولات مرتبط</h2>
      <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[65%] shrink-0 snap-start sm:w-[280px] md:w-[260px]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
