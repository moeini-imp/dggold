import { shopGetJson } from "@/lib/shop/http";
import { products as mockProducts } from "@/lib/mock/data";

/**
 * Landing page is composed of ordered components from the backend:
 *  - "Slider": a banner carousel; each image links somewhere (often external).
 *  - "Product": a titled section with a row of products.
 */

export interface LandingProduct {
  id: number;
  slug?: string; // for linking in the mock fallback (real API links by id)
  categoryId?: number;
  imageUrl: string;
  name: string;
  info: string;
  weight: number;
  totalPrice: number; // original price
  finalPrice: number; // after discount
  discountPercent: number;
}

export interface LandingSliderImage {
  imageUrl: string;
  link: string | null;
}

export interface LandingComponent {
  id: number;
  type: "Slider" | "Product" | string;
  name: string;
  badge: string;
  hasMore: boolean;
  hasButton: boolean;
  buttonText: string | null;
  url: string | null;
  products: LandingProduct[];
  images: LandingSliderImage[];
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normProduct(p: Raw): LandingProduct {
  const discount = (p.discount ?? {}) as Raw;
  const percent = num(discount.percent);
  const raw = num(discount.rawValue);
  const total = num(p.totalPrice);
  return {
    id: num(p.id),
    slug: p.slug ? String(p.slug) : undefined,
    categoryId: p.categoryId != null ? num(p.categoryId) : undefined,
    imageUrl: String(p.imageUrl ?? ""),
    name: String(p.name ?? ""),
    info: String(p.info ?? ""),
    weight: num(p.weight),
    totalPrice: total,
    finalPrice: percent > 0 && raw > 0 ? raw : total,
    discountPercent: percent,
  };
}

function normComponent(c: Raw): LandingComponent {
  const m = (c.metaData ?? {}) as Raw;
  const badge = (m.badge ?? {}) as Raw;
  return {
    id: num(c.id),
    type: String(c.type ?? ""),
    name: String(m.name ?? ""),
    badge: String(badge.title ?? ""),
    hasMore: !!m.hasMore,
    hasButton: !!m.hasButton,
    buttonText: (m.buttonText as string) ?? null,
    url: (m.url as string) ?? null,
    products: Array.isArray(m.products) ? m.products.map(normProduct) : [],
    images: Array.isArray(m.images)
      ? (m.images as Raw[]).map((i) => ({
          imageUrl: String(i.imageUrl ?? ""),
          link: (i.link as string) ?? null,
        }))
      : [],
  };
}

/** Fetch the backend-composed components for a page. Returns null on failure. */
export async function getLandingComponents(
  pageName: string,
): Promise<LandingComponent[] | null> {
  const json = (await shopGetJson(
    `/LandingPage/GetComponents?PageName=${encodeURIComponent(pageName)}`,
  )) as { data?: unknown } | null;
  if (!Array.isArray(json?.data)) return null;
  return (json.data as Raw[]).map(normComponent);
}

/**
 * Full product list behind a single landing component's "مشاهده بیشتر"
 * button (LandingPage/GetComponentProducts?Id=). Returns null on failure.
 */
export async function getComponentProducts(
  componentId: number,
): Promise<LandingComponent | null> {
  const json = (await shopGetJson(
    `/LandingPage/GetComponentProducts?Id=${componentId}`,
  )) as { data?: { list?: unknown } } | null;
  const list = json?.data?.list;
  if (!Array.isArray(list) || list.length === 0) return null;
  return normComponent(list[0] as Raw);
}

/**
 * Fallback content (same shape as the API) so the homepage still renders when
 * the backend is unreachable. Built from the local mock catalog.
 */
export function buildMockLanding(): LandingComponent[] {
  const toLanding = (slug: string): LandingProduct | null => {
    const p = mockProducts.find((x) => x.slug === slug);
    if (!p) return null;
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
  };
  const section = (
    id: number,
    name: string,
    badge: string,
    slugs: string[],
    buttonText: string | null = null,
  ) => ({
    id,
    type: "Product" as const,
    name,
    badge,
    hasMore: true,
    hasButton: !!buttonText,
    buttonText,
    url: null,
    products: slugs.map(toLanding).filter((x): x is LandingProduct => !!x),
    images: [],
  });

  return [
    {
      id: 0,
      type: "Slider",
      name: "اسلایدر",
      badge: "",
      hasMore: false,
      hasButton: false,
      buttonText: null,
      url: null,
      products: [],
      images: [
        { imageUrl: "placeholder:banner-1", link: "/categories" },
        { imageUrl: "placeholder:banner-2", link: "/categories" },
      ],
    },
    section(
      1,
      "جدیدترین‌ها",
      "💛",
      ["abshode-750-5790", "venus-plak-18", "sekke-emami", "gardanband-tala-18"],
      "پاشو بیا اینجا",
    ),
    section(2, "سکه و شمش", "", [
      "shemsh-18-marbar-0050",
      "shemsh-18-aminzar-0050",
      "nim-sekke-bahar",
      "noghre-plak-999",
    ]),
  ];
}

/** Mock fallback for a single component's product list, matched by id. */
export function buildMockComponentProducts(
  componentId: number,
): LandingComponent | null {
  return (
    buildMockLanding().find(
      (c) => c.type === "Product" && c.id === componentId,
    ) ?? null
  );
}
