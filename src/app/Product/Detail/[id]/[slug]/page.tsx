import type { Metadata } from "next";
import { ProductDetailReal } from "@/components/product/ProductDetailReal";
import {
  getProductDetail,
  buildMockProductDetail,
  getRelatedProducts,
} from "@/lib/shop/product";

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
  const detail =
    (await getProductDetail(id, slug)) ?? buildMockProductDetail(id, slug);
  const related = detail.id ? await getRelatedProducts(detail.id) : [];
  return <ProductDetailReal detail={detail} related={related} />;
}
