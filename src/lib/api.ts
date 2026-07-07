/**
 * Data access layer.
 *
 * Today these read from the in-memory mock. When the real backend lands,
 * replace each function body with a fetch() to the matching endpoint — the
 * return types are the contract and shouldn't change. Components/pages only
 * ever import from here, never from `lib/mock`.
 */
import { categories, products, vendors } from "@/lib/mock/data";
import type {
  CartDisplayLine,
  CartLine,
  Category,
  Product,
  ProductListItem,
  Vendor,
} from "@/lib/types";

function toListItem(p: Product): ProductListItem {
  const best = p.offers[0];
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    imageUrl: p.imageUrl,
    price: best.price,
    originalPrice: best.originalPrice,
    vendorName: best.vendorName,
    offerCount: p.offers.length,
  };
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getHomeSections(): Promise<
  { category: Category; products: ProductListItem[] }[]
> {
  // Featured home rows, mirroring the live site's category carousels.
  const featuredSlugs = [
    "sekke-parsian",
    "sekke-bahar",
    "tala-abshode",
    "shemsh-plak-18",
  ];
  return featuredSlugs
    .map((slug) => {
      const category = categories.find((c) => c.slug === slug);
      if (!category) return null;
      const items = products
        .filter((p) => p.categoryId === category.id)
        .map(toListItem);
      // Fall back to a general mix so every row has cards in the mock.
      const list = items.length ? items : products.slice(0, 4).map(toListItem);
      return { category, products: list };
    })
    .filter(Boolean) as { category: Category; products: ProductListItem[] }[];
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getVendorBySlug(
  slug: string,
): Promise<Vendor | undefined> {
  return vendors.find((v) => v.slug === slug);
}

export async function getProductsByCategory(
  categoryId: string,
): Promise<ProductListItem[]> {
  return products.filter((p) => p.categoryId === categoryId).map(toListItem);
}

/**
 * Resolve cart lines (id-only) into display data by joining to the product and
 * the chosen vendor offer. Lines whose product/offer no longer exist are
 * dropped. With a real backend this becomes a single resolve-cart request.
 */
export async function resolveCartLines(
  lines: CartLine[],
): Promise<CartDisplayLine[]> {
  return lines
    .map((line): CartDisplayLine | null => {
      // Real API products carry a display snapshot — use it directly.
      if (line.meta) {
        return {
          productId: line.productId,
          vendorId: line.vendorId,
          slug: line.meta.slug ?? "",
          title: line.meta.title,
          imageUrl: line.meta.imageUrl,
          vendorName: line.meta.vendorName,
          unitPrice: line.meta.unitPrice,
          originalUnitPrice: line.meta.originalUnitPrice,
          quantity: line.quantity,
          maxQuantity: line.meta.maxQuantity,
          lineTotal: line.meta.unitPrice * line.quantity,
        };
      }
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;
      const offer = product.offers.find((o) => o.vendorId === line.vendorId);
      if (!offer) return null;
      return {
        productId: product.id,
        vendorId: offer.vendorId,
        slug: product.slug,
        title: product.title,
        imageUrl: product.imageUrl,
        vendorName: offer.vendorName,
        unitPrice: offer.price,
        originalUnitPrice: offer.originalPrice,
        quantity: line.quantity,
        maxQuantity: offer.maxQuantity ?? 10,
        lineTotal: offer.price * line.quantity,
      };
    })
    .filter((x): x is CartDisplayLine => x !== null);
}

/** Related products for a PDP: same category first, then fill from the rest. */
export async function getRelatedProducts(
  product: Product,
  limit = 8,
): Promise<ProductListItem[]> {
  const sameCat = products.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id,
  );
  const others = products.filter(
    (p) => p.categoryId !== product.categoryId && p.id !== product.id,
  );
  return [...sameCat, ...others].slice(0, limit).map(toListItem);
}
