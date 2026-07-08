import type { Metadata } from "next";
import Link from "next/link";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import { Pagination } from "@/components/ui/Pagination";
import {
  getCategoryProducts,
  getProductsByCategoryId,
  buildMockCategoryProducts,
} from "@/lib/shop/category";
import { toPersianDigits } from "@/lib/format";
import type { LandingProduct } from "@/lib/shop/landing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  return { title: `${decodeURIComponent(name)} | دیجی گلد` };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ cid?: string; page?: string }>;
}) {
  const { name } = await params;
  const { cid, page } = await searchParams;
  const categoryName = decodeURIComponent(name);
  const categoryId = cid ? Number(cid) : null;
  const pageIndex = Math.max(1, Number(page) || 1);

  let products: LandingProduct[];
  let pageCounts = 1;

  if (categoryId) {
    // CategoryId includes items from child categories (a parent like "طلا"
    // shows everything underneath it), unlike a name match.
    const result = await getProductsByCategoryId(categoryId, { pageIndex });
    if (result) {
      products = result.items;
      pageCounts = result.pageCounts;
    } else {
      products = buildMockCategoryProducts();
    }
  } else {
    // No id in the URL (rare) — fall back to matching by name, no pagination.
    products =
      (await getCategoryProducts(categoryName)) ?? buildMockCategoryProducts();
  }

  const makeHref = (p: number) =>
    `/category/${encodeURIComponent(categoryName)}?cid=${categoryId ?? ""}&page=${p}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-ink md:text-2xl">
          {categoryName}
        </h1>
        <span className="text-sm text-muted tnum">
          {toPersianDigits(products.length)} محصول
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-lg font-bold text-ink">
            محصولی در این دسته‌بندی یافت نشد
          </p>
          <Link
            href="/"
            className="rounded-btn bg-teal-600 px-6 py-2.5 text-sm font-bold text-surface hover:bg-teal-700"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <LandingProductCard key={p.id} product={p} />
            ))}
          </div>

          {categoryId ? (
            <Pagination
              currentPage={pageIndex}
              totalPages={pageCounts}
              makeHref={makeHref}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
