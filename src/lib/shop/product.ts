import { shopGetJson } from "@/lib/shop/http";
import { buildMockCategoryProducts, normListProduct } from "@/lib/shop/category";
import type { LandingProduct } from "@/lib/shop/landing";

export interface Money {
  rawValue: number;
  percent: number;
}

export interface ProductVendor {
  id: number;
  name: string;
  englishName: string;
  imageUrl: string;
}

export interface ProductDetail {
  id: number;
  slug: string;
  name: string;
  description: string;
  imagesUrl: string[];
  countAvailable: number;
  weight: number;
  categoryId: number;
  categoryName: string;
  carat: number;
  pureMassPrice: number; // قیمت خالص فلز
  laborFee: Money; // اجرت
  interest: Money; // سود فروشنده
  tax: Money; // مالیات
  discount: Money; // تخفیف (rawValue = amount in detail)
  extraCost: number; // هزینه‌های جانبی
  totalPrice: number; // قیمت نهایی
  vendor: ProductVendor | null;
  dynamicProperties: { title: string; value: string }[];
  similarProducts: LandingProduct[];
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function money(v: unknown): Money {
  const o = (v ?? {}) as Raw;
  return { rawValue: num(o.rawValue), percent: num(o.percent) };
}

function normDetail(d: Raw): ProductDetail {
  const imagesUrl = Array.isArray(d.imagesUrl)
    ? (d.imagesUrl as unknown[]).map(String)
    : [];
  const vendorRaw = d.vendor as Raw | null;
  const props = Array.isArray(d.dynamicProperties)
    ? (d.dynamicProperties as Raw[]).map((p) => ({
        title: String(p.title ?? ""),
        value: String(p.value ?? ""),
      }))
    : [];
  return {
    id: num(d.id),
    slug: String(d.slug ?? ""),
    name: String(d.name ?? ""),
    description: String(d.description ?? ""),
    imagesUrl,
    countAvailable: num(d.countAvailable),
    weight: num(d.weight),
    categoryId: num(d.categoryId),
    categoryName: String(d.categoryName ?? ""),
    carat: num(d.carat),
    pureMassPrice: num(d.pureMassPrice),
    laborFee: money(d.laborFee),
    interest: money(d.interest),
    tax: money(d.tax),
    discount: money(d.discount),
    extraCost: num(d.extraCost),
    totalPrice: num(d.totalPrice),
    vendor: vendorRaw
      ? {
          id: num(vendorRaw.id),
          name: String(vendorRaw.name ?? "").trim(),
          englishName: String(vendorRaw.englishName ?? vendorRaw.username ?? ""),
          imageUrl: String(vendorRaw.imageUrl ?? ""),
        }
      : null,
    dynamicProperties: props,
    similarProducts: [],
  };
}

/** Product detail by id + slug. Returns null on failure. */
export async function getProductDetail(
  id: string,
  slug: string,
): Promise<ProductDetail | null> {
  const json = (await shopGetJson(
    `/Product/Detail/${id}/${encodeURIComponent(slug)}`,
  )) as { data?: unknown } | null;
  if (!json?.data || typeof json.data !== "object") return null;
  return normDetail(json.data as Raw);
}

/**
 * Related products for a PDP, via the real, previously-unwired
 * `Product/RelatedProducts` endpoint — takes the product's own `Id` (not a
 * category filter; confirmed live — `CategoryId` alone returns an empty list,
 * `Id=<productId>` returns the backend's actual related set). Used both for
 * the "سایر وزن‌های این محصول" chip row and the "محصولات مرتبط" grid (each
 * weight is a fully separate product in this backend, so this is the closest
 * real substitute for a variant list). Returns [] on failure so sections just
 * don't render.
 */
export async function getRelatedProducts(
  productId: number,
  limit = 8,
): Promise<LandingProduct[]> {
  const json = (await shopGetJson(
    `/Product/RelatedProducts?Id=${productId}&PageIndex=1&PageSize=${limit}`,
  )) as { data?: { list?: unknown } } | null;
  const list = json?.data?.list;
  if (!Array.isArray(list)) return [];
  return (list as Raw[])
    .map(normListProduct)
    .filter((p) => p.id !== productId)
    .slice(0, limit);
}

/** Mock detail so the PDP renders when the API is unreachable. */
export function buildMockProductDetail(
  id: string,
  slug: string,
): ProductDetail {
  const name = decodeURIComponent(slug).replace(/-/g, " ") || "محصول طلا";
  return {
    id: Number(id) || 0,
    slug: decodeURIComponent(slug),
    name,
    description:
      "این محصول از فروشندگان معتبر بازار طلای تهران عرضه می‌شود. قیمت بر اساس نرخ روز طلا، وزن و اجرت محاسبه می‌شود.",
    imagesUrl: ["placeholder:gold", "placeholder:bar"],
    countAvailable: 12,
    weight: 12,
    categoryId: 6,
    categoryName: "دستبند",
    carat: 18,
    pureMassPrice: 2016240000,
    laborFee: { rawValue: 342760800, percent: 17 },
    interest: { rawValue: 165130056, percent: 7 },
    tax: { rawValue: 45710177, percent: 9 },
    discount: { rawValue: 50722617, percent: 2 },
    extraCost: 12000000,
    totalPrice: 2530204212,
    vendor: {
      id: 1,
      name: "معین طلا",
      englishName: "Moein",
      imageUrl: "",
    },
    dynamicProperties: [
      { title: "سایز", value: "متوسط" },
      { title: "جنسیت", value: "مردانه" },
    ],
    similarProducts: buildMockCategoryProducts().slice(0, 4),
  };
}
