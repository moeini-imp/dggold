import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LandingProductCard } from "@/components/home/LandingProductCard";
import {
  getComponentProducts,
  buildMockComponentProducts,
} from "@/lib/shop/landing";
import { toPersianDigits } from "@/lib/format";

async function loadComponent(id: number) {
  return (await getComponentProducts(id)) ?? buildMockComponentProducts(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const component = await loadComponent(Number(id));
  return { title: `${component?.name ?? "محصولات"} | دیجی گلد` };
}

export default async function LandingComponentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const component = await loadComponent(Number(id));
  if (!component) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-ink md:text-2xl">
          {component.name}
          {component.badge ? <span>{component.badge}</span> : null}
        </h1>
        <span className="text-sm text-muted tnum">
          {toPersianDigits(component.products.length)} محصول
        </span>
      </div>

      {component.products.length === 0 ? (
        <p className="py-16 text-center text-muted">محصولی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {component.products.map((p) => (
            <LandingProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
