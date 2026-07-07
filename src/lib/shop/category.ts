import { shopGetJson } from "@/lib/shop/http";
import { products as mockProducts } from "@/lib/mock/data";
import type { LandingProduct } from "@/lib/shop/landing";

export interface ShopCategory {
  id: number;
  parentId: number | null;
  name: string;
  imageUrl: string;
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Category list (public). Returns null on failure so callers can fall back. */
export async function getShopCategories(): Promise<ShopCategory[] | null> {
  const json = (await shopGetJson("/Category/List")) as {
    data?: unknown;
  } | null;
  if (!Array.isArray(json?.data)) return null;
  return (json.data as Raw[]).map((c) => ({
    id: num(c.id),
    parentId: c.parentId == null ? null : num(c.parentId),
    name: String(c.name ?? ""),
    imageUrl: String(c.imageUrl ?? ""),
  }));
}

export function normListProduct(p: Raw): LandingProduct {
  const discount = (p.discount ?? {}) as Raw;
  const percent = num(discount.percent);
  const raw = num(discount.rawValue);
  const total = num(p.totalPrice);
  const imagesUrl = Array.isArray(p.imagesUrl) ? (p.imagesUrl as unknown[]) : [];
  return {
    id: num(p.id),
    slug: p.slug ? String(p.slug) : undefined,
    categoryId: num(p.categoryId),
    imageUrl: String(imagesUrl[0] ?? ""),
    name: String(p.name ?? ""),
    info: String(p.info ?? ""),
    weight: num(p.weight),
    totalPrice: total,
    finalPrice: percent > 0 && raw > 0 ? raw : total,
    discountPercent: percent,
  };
}

/** Products in a category (public). Returns null on failure. */
export async function getCategoryProducts(
  categoryName: string,
): Promise<LandingProduct[] | null> {
  const json = (await shopGetJson(
    `/Product/List?CategoryName=${encodeURIComponent(categoryName)}`,
  )) as { data?: { list?: unknown } } | null;
  const list = json?.data?.list;
  if (!Array.isArray(list)) return null;
  return (list as Raw[]).map(normListProduct);
}

/* ---- mock fallbacks (when the API is unreachable) ---- */

export function buildMockCategories(): ShopCategory[] {
  // Mirror the real API shape: parents + children via parentId.
  const parents: ShopCategory[] = [
    { id: 1, parentId: null, name: "مصنوعات طلا", imageUrl: "" },
    { id: 2, parentId: null, name: "سکه و شمش", imageUrl: "" },
    { id: 3, parentId: null, name: "نقره", imageUrl: "" },
  ];
  const children: ShopCategory[] = [
    { id: 6, parentId: 1, name: "دستبند", imageUrl: "" },
    { id: 7, parentId: 1, name: "النگو", imageUrl: "" },
    { id: 8, parentId: 1, name: "گردنبند", imageUrl: "" },
    { id: 9, parentId: 1, name: "بچگانه", imageUrl: "" },
    { id: 10, parentId: 1, name: "اسپورت", imageUrl: "" },
    { id: 11, parentId: 2, name: "سکه بهار آزادی", imageUrl: "" },
    { id: 12, parentId: 2, name: "سکه پارسیان", imageUrl: "" },
    { id: 13, parentId: 2, name: "شمش طلا", imageUrl: "" },
    { id: 14, parentId: 2, name: "طلای آبشده", imageUrl: "" },
    { id: 15, parentId: 3, name: "شمش نقره", imageUrl: "" },
    { id: 16, parentId: 3, name: "مصنوعات نقره", imageUrl: "" },
  ];
  return [...parents, ...children];
}

export function buildMockCategoryProducts(): LandingProduct[] {
  return mockProducts.slice(0, 8).map((p) => {
    const best = p.offers[0];
    const total = best.originalPrice ?? best.price;
    const percent =
      best.originalPrice && best.originalPrice > best.price
        ? Math.round(((best.originalPrice - best.price) / best.originalPrice) * 100)
        : 0;
    return {
      id: Number(p.id.replace(/\D/g, "")) || 0,
      slug: p.slug,
      imageUrl: p.imageUrl,
      name: p.title,
      info: "",
      weight: p.weightGram ?? 0,
      totalPrice: total,
      finalPrice: best.price,
      discountPercent: percent,
    };
  });
}
