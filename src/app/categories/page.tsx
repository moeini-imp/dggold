import type { Metadata } from "next";
import { CategoryTree } from "@/components/category/CategoryTree";
import { getShopCategories, buildMockCategories } from "@/lib/shop/category";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها | دیجی گلد",
};

export default async function CategoriesPage() {
  const categories = (await getShopCategories()) ?? buildMockCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <h1 className="mb-6 text-xl font-extrabold text-ink md:text-2xl">
        دسته‌بندی‌ها
      </h1>
      <CategoryTree categories={categories} />
    </div>
  );
}
