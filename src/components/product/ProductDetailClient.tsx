"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "@/components/ui/icons";
import { OtherVendorsSheet } from "@/components/product/OtherVendorsSheet";
import { ProductActionBar } from "@/components/product/ProductActionBar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PriceDetails } from "@/components/product/PriceDetails";
import { ProductDescription } from "@/components/product/ProductDescription";
import { SellerBox } from "@/components/product/SellerBox";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { toPersianDigits } from "@/lib/format";
import type { Product, ProductListItem } from "@/lib/types";

export function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: ProductListItem[];
}) {
  const [selectedVendorId, setSelectedVendorId] = useState(
    product.offers[0].vendorId,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const offer =
    product.offers.find((o) => o.vendorId === selectedVendorId) ??
    product.offers[0];

  const hasOtherSellers = product.offers.length > 1;

  const meta = [
    product.karat ? `عیار ${toPersianDigits(product.karat)}` : null,
    product.weightGram
      ? `وزن ${toPersianDigits(product.weightGram)} گرم`
      : null,
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 pb-44 md:px-6 md:py-8 md:pb-28">
      {/* breadcrumb / back */}
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition hover:text-teal-700"
      >
        بازگشت به فروشگاه
        <ChevronLeft className="h-4 w-4" />
      </Link>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        {/* gallery (RTL start = right) */}
        <div className="min-w-0 space-y-5">
          <ProductGallery
            images={product.images?.length ? product.images : [product.imageUrl]}
            alt={product.title}
          />

          {/* Fill the space below the gallery (desktop only): other sellers
              box if any, otherwise the product description. */}
          <div className="hidden md:block">
            {hasOtherSellers ? (
              <SellerBox
                offers={product.offers}
                selectedVendorId={selectedVendorId}
                onSelect={setSelectedVendorId}
                onSeeAll={() => setSheetOpen(true)}
              />
            ) : (
              <ProductDescription description={product.description} />
            )}
          </div>
        </div>

        {/* info */}
        <div className="min-w-0 space-y-5">
          <div>
            <h1 className="text-xl font-extrabold leading-relaxed text-ink md:text-2xl">
              {product.title}
            </h1>

            {meta.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {meta.map((m) => (
                  <span
                    key={m}
                    className="rounded-lg bg-gold-50 px-3 py-1 text-xs font-medium text-gold-600"
                  >
                    {m}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* price breakdown — seller name lives here (only place it shows) */}
          <PriceDetails product={product} offer={offer} />

          {/* seller box on mobile (desktop shows it under the gallery) */}
          {hasOtherSellers ? (
            <SellerBox
              className="md:hidden"
              offers={product.offers}
              selectedVendorId={selectedVendorId}
              onSelect={setSelectedVendorId}
              onSeeAll={() => setSheetOpen(true)}
            />
          ) : null}

          {/* description — always on mobile; on desktop only when the seller
              box took the gallery-column slot (avoids duplication). */}
          <ProductDescription
            description={product.description}
            className={hasOtherSellers ? "" : "md:hidden"}
          />
        </div>
      </div>

      {/* related items */}
      <RelatedProducts products={related} />

      {/* sticky buy bar — bottom of page on all breakpoints */}
      <ProductActionBar product={product} offer={offer} />

      <OtherVendorsSheet
        open={sheetOpen}
        offers={product.offers}
        selectedVendorId={selectedVendorId}
        onSelect={setSelectedVendorId}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
