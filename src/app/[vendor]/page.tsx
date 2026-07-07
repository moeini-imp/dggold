import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorProducts } from "@/components/vendor/VendorProducts";
import { toPersianDigits } from "@/lib/format";
import {
  getVendors,
  getVendorProducts,
  buildMockVendors,
  type Vendor,
} from "@/lib/shop/vendor";
import { buildMockCategoryProducts } from "@/lib/shop/category";

async function resolveVendor(englishName: string): Promise<Vendor | null> {
  const list = (await getVendors()) ?? buildMockVendors();
  const lower = decodeURIComponent(englishName).toLowerCase();
  return list.find((v) => v.englishName.toLowerCase() === lower) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendor: string }>;
}): Promise<Metadata> {
  const { vendor } = await params;
  const v = await resolveVendor(vendor);
  return { title: v ? `${v.name} | دیجی گلد` : "فروشنده | دیجی گلد" };
}

export default async function VendorPage({
  params,
}: {
  params: Promise<{ vendor: string }>;
}) {
  const { vendor } = await params;
  const v = await resolveVendor(vendor);
  if (!v) notFound();

  const products =
    (await getVendorProducts(v.id)) ?? buildMockCategoryProducts();

  return (
    <div className="pb-10">
      {/* banner header with overlaid logo */}
      <div className="relative">
        <div className="aspect-[3/1] w-full overflow-hidden bg-gradient-to-l from-teal-800 via-teal-700 to-teal-600 md:aspect-[5/1]">
          {v.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={v.bannerUrl}
              alt={v.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="-mt-12 flex flex-col items-center px-4 text-center">
          <span className="h-24 w-24 overflow-hidden rounded-full border-4 border-surface bg-surface shadow-card">
            {v.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={v.imageUrl}
                alt={v.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center bg-teal-50 text-2xl font-bold text-teal-700">
                {v.name.slice(0, 1)}
              </span>
            )}
          </span>
          <h1 className="mt-3 text-xl font-extrabold text-ink md:text-2xl">
            {v.name}
          </h1>
          {v.address ? (
            <p className="mt-1 max-w-md text-sm text-muted">{v.address}</p>
          ) : null}
          {v.productCounts ? (
            <p className="mt-1 text-xs text-muted tnum">
              {toPersianDigits(v.productCounts)} محصول
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
        <VendorProducts products={products} />
      </div>
    </div>
  );
}
