import { shopGetJson } from "@/lib/shop/http";
import { normListProduct } from "@/lib/shop/category";
import type { LandingProduct } from "@/lib/shop/landing";

export interface Vendor {
  id: number;
  name: string;
  englishName: string;
  imageUrl: string;
  bannerUrl: string;
  address: string;
  productCounts: number;
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normVendor(v: Raw): Vendor {
  return {
    id: num(v.id),
    name: String(v.name ?? "").trim(),
    englishName: String(v.englishName ?? v.username ?? ""),
    imageUrl: String(v.imageUrl ?? ""),
    bannerUrl: String(v.bannerUrl ?? ""),
    address: String(v.address ?? ""),
    productCounts: num(v.productCounts),
  };
}

/** All vendors (public). Returns null on failure. */
export async function getVendors(): Promise<Vendor[] | null> {
  const json = (await shopGetJson("/Vendors/Vendors")) as {
    data?: unknown;
  } | null;
  if (!Array.isArray(json?.data)) return null;
  return (json.data as Raw[]).map(normVendor);
}

/** Resolve a vendor by its englishName (used for the /{englishName} route). */
export async function getVendorByEnglishName(
  englishName: string,
): Promise<Vendor | null> {
  const list = await getVendors();
  if (!list) return null;
  const lower = englishName.toLowerCase();
  return (
    list.find((v) => v.englishName.toLowerCase() === lower) ?? null
  );
}

/** Products for a vendor (Product/List?VendorId=). Returns null on failure. */
export async function getVendorProducts(
  vendorId: number,
): Promise<LandingProduct[] | null> {
  const json = (await shopGetJson(
    `/Product/List?VendorId=${vendorId}`,
  )) as { data?: { list?: unknown } } | null;
  const list = json?.data?.list;
  if (!Array.isArray(list)) return null;
  return (list as Raw[]).map(normListProduct);
}

/* ---- mock fallbacks ---- */

export function buildMockVendors(): Vendor[] {
  return [
    {
      id: 1,
      name: "معین طلا",
      englishName: "Moein",
      imageUrl: "",
      bannerUrl: "",
      address: "تهران، میدان آزادی",
      productCounts: 2,
    },
    {
      id: 2,
      name: "محسن گالری",
      englishName: "mohsen",
      imageUrl: "",
      bannerUrl: "",
      address: "تهران، خیابان آزادی",
      productCounts: 0,
    },
  ];
}
