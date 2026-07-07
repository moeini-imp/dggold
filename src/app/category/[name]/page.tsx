import type { Metadata } from "next";
import Link from "next/link";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import {
  getCategoryProducts,
  buildMockCategoryProducts,
} from "@/lib/shop/category";
import { toPersianDigits } from "@/lib/format";

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
  searchParams: Promise<{ cid?: string }>;
}) {
  const { name } = await params;
  const { cid } = await searchParams;
  const categoryName = decodeURIComponent(name);
  const fetched =
    (await getCategoryProducts(categoryName)) ?? buildMockCategoryProducts();

  // The API can return the whole parent group; keep only the clicked category.
  const categoryId = cid ? Number(cid) : null;
  const hasCategoryIds = fetched.some((p) => p.categoryId != null);
  const products =
    categoryId && hasCategoryIds
      ? fetched.filter((p) => p.categoryId === categoryId)
      : fetched;

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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <LandingProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
