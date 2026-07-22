import type { Metadata } from "next";
import { ProductDetailReal } from "@/components/product/ProductDetailReal";
import {
  getProductDetail,
  buildMockProductDetail,
  getRelatedProducts,
} from "@/lib/shop/product";
import { getLastAssetPrices, buildMockAssetPrices } from "@/lib/shop/assetPrice";
import { sootForToman } from "@/lib/wallet/granule";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;
  const detail =
    (await getProductDetail(id, slug)) ?? buildMockProductDetail(id, slug);
  return { title: `${detail.name} | دیجی گلد`, description: detail.description };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  const [detail0, prices] = await Promise.all([
    getProductDetail(id, slug),
    getLastAssetPrices(),
  ]);
  const detail = detail0 ?? buildMockProductDetail(id, slug);
  const related = detail.id ? await getRelatedProducts(detail.id) : [];

  // How many سوت of gold granule this product's price is worth (symbol 3 =
  // طلای آب‌شده, per-gram Toman). Lets a buyer gauge it against wallet granule.
  const goldPricePerGram =
    (prices ?? buildMockAssetPrices()).find((p) => p.symbol === 3)?.price ?? 0;
  const granuleSoot = sootForToman(detail.totalPrice, goldPricePerGram);

  return (
    <ProductDetailReal
      detail={detail}
      related={related}
      granuleSoot={granuleSoot}
    />
  );
}
