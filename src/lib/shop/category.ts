import { shopGetJson } from "@/lib/shop/http";
import { psychologicalOffer } from "@/lib/shop/pricing";
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

/** A category node in the real parent→children tree (Category/Tree). */
export interface CategoryTreeNode {
  id: number;
  name: string;
  imageUrl: string;
  children: CategoryTreeNode[];
}

function normTreeNode(c: Raw): CategoryTreeNode {
  return {
    id: num(c.id),
    name: String(c.name ?? ""),
    imageUrl: String(c.imageUrl ?? ""),
    children: Array.isArray(c.children)
      ? (c.children as Raw[]).map(normTreeNode)
      : [],
  };
}

/** Finds a node anywhere in the tree by id (depth-first). */
export function findCategoryNode(
  tree: CategoryTreeNode[],
  id: number,
): CategoryTreeNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    const found = findCategoryNode(node.children, id);
    if (found) return found;
  }
  return null;
}

/**
 * Full category tree for the دسته‌بندی‌ها page (Category/Tree — public).
 * Returns null on failure so callers can fall back to mock data.
 */
export async function getCategoryTree(): Promise<CategoryTreeNode[] | null> {
  const json = (await shopGetJson("/Category/Tree")) as {
    data?: unknown;
  } | null;
  if (!Array.isArray(json?.data)) return null;
  return (json.data as Raw[]).map(normTreeNode);
}

/**
 * Maps the richer product shape returned by `Product/List` and
 * `Product/RelatedProducts` — unlike the homepage's landing-component
 * products, these include `vendor` and `slug`, so cards built from this can
 * add-to-cart directly instead of only linking through to the product page.
 */
export function normListProduct(p: Raw): LandingProduct {
  const cash = num(p.cashPrice) || num(p.totalPrice); // totalPrice = old API
  const offer = psychologicalOffer(cash, num(p.psychologicalOfferPriceRatio));
  const imagesUrl = Array.isArray(p.imagesUrl) ? (p.imagesUrl as unknown[]) : [];
  const vendor = p.vendor as Raw | null;
  return {
    id: num(p.id),
    slug: p.slug ? String(p.slug) : undefined,
    categoryId: num(p.categoryId),
    vendorId: vendor?.id != null ? num(vendor.id) : undefined,
    vendorName: vendor?.name ? String(vendor.name) : undefined,
    imageUrl: String(imagesUrl[0] ?? ""),
    name: String(p.name ?? ""),
    info: String(p.info ?? ""),
    weight: num(p.weight),
    totalPrice: offer.originalPrice || cash,
    finalPrice: offer.finalPrice,
    discountPercent: offer.discountPercent,
    creditPrice: num(p.creditPrice) || cash,
  };
}

/** Products in a category, matched by exact name (public). Returns null on failure. */
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

export interface CategoryProductPage {
  items: LandingProduct[];
  pageIndex: number;
  pageSize: number;
  pageCounts: number;
}

const DEFAULT_CATEGORY_PAGE_SIZE = 24;

/**
 * Products under a category id — the backend includes items from child
 * categories too (so a parent like "طلا" returns everything underneath it,
 * not just items tagged with that exact id). Paginated. Public, no auth
 * needed. Returns null on failure so callers can fall back to mock data.
 */
export async function getProductsByCategoryId(
  categoryId: number,
  opts: { pageIndex?: number; pageSize?: number } = {},
): Promise<CategoryProductPage | null> {
  const pageIndex = Math.max(1, opts.pageIndex ?? 1);
  const pageSize = opts.pageSize ?? DEFAULT_CATEGORY_PAGE_SIZE;
  const json = (await shopGetJson(
    `/Product/List?CategoryId=${categoryId}&PageIndex=${pageIndex}&PageSize=${pageSize}`,
  )) as { data?: { list?: unknown; argument?: Raw } } | null;
  const list = json?.data?.list;
  if (!Array.isArray(list)) return null;
  const arg = json?.data?.argument ?? {};
  return {
    items: (list as Raw[]).map(normListProduct),
    pageIndex: num(arg.pageIndex) || pageIndex,
    pageSize: num(arg.pageSize) || pageSize,
    pageCounts: Math.max(1, num(arg.pageCounts) || 1),
  };
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

/** Mock fallback for the /categories tree page — mirrors Category/Tree's 3-layer shape. */
export function buildMockCategoryTree(): CategoryTreeNode[] {
  return [
    {
      id: 1,
      name: "مصنوعات طلا",
      imageUrl: "",
      children: [
        {
          id: 101,
          name: "طلا زنانه",
          imageUrl: "",
          children: [
            { id: 6, name: "دستبند طلا", imageUrl: "", children: [] },
            { id: 7, name: "النگو طلا", imageUrl: "", children: [] },
            { id: 8, name: "گردنبند طلا", imageUrl: "", children: [] },
            { id: 102, name: "گوشواره طلا", imageUrl: "", children: [] },
            { id: 103, name: "انگشتر طلا", imageUrl: "", children: [] },
          ],
        },
        {
          id: 104,
          name: "طلا مردانه و کادویی",
          imageUrl: "",
          children: [
            { id: 9, name: "طلا بچگانه", imageUrl: "", children: [] },
            { id: 10, name: "طلا اسپورت", imageUrl: "", children: [] },
            { id: 105, name: "پلاک و زنجیر", imageUrl: "", children: [] },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "سکه و شمش",
      imageUrl: "",
      children: [
        {
          id: 106,
          name: "سکه بهار آزادی",
          imageUrl: "",
          children: [
            { id: 11, name: "سکه طرح جدید (امامی)", imageUrl: "", children: [] },
            { id: 107, name: "نیم سکه بهار آزادی", imageUrl: "", children: [] },
            { id: 108, name: "ربع سکه بهار آزادی", imageUrl: "", children: [] },
          ],
        },
        {
          id: 109,
          name: "سکه پارسیان و کادویی",
          imageUrl: "",
          children: [
            { id: 12, name: "سکه پارسیان", imageUrl: "", children: [] },
            { id: 110, name: "کارت کادویی طلا", imageUrl: "", children: [] },
          ],
        },
        {
          id: 111,
          name: "طلای سرمایه‌گذاری",
          imageUrl: "",
          children: [
            { id: 13, name: "شمش طلا", imageUrl: "", children: [] },
            { id: 14, name: "طلای آبشده", imageUrl: "", children: [] },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "نقره",
      imageUrl: "",
      children: [
        {
          id: 112,
          name: "شمش و ساچمه نقره",
          imageUrl: "",
          children: [
            { id: 15, name: "شمش نقره", imageUrl: "", children: [] },
            { id: 113, name: "ساچمه نقره ۹۹۹", imageUrl: "", children: [] },
          ],
        },
        {
          id: 114,
          name: "مصنوعات و زیورآلات نقره",
          imageUrl: "",
          children: [
            { id: 16, name: "مصنوعات نقره", imageUrl: "", children: [] },
            { id: 115, name: "انگشتر و زیورآلات نقره", imageUrl: "", children: [] },
          ],
        },
      ],
    },
  ];
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
