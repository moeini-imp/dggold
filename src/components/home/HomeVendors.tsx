import Link from "next/link";
import { HScroller } from "@/components/ui/HScroller";
import type { Vendor } from "@/lib/shop/vendor";

function VendorAvatar({ vendor }: { vendor: Vendor }) {
  if (vendor.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={vendor.imageUrl}
        alt={vendor.name}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <span className="grid h-full w-full place-items-center bg-teal-50 text-lg font-bold text-teal-700">
      {vendor.name.slice(0, 1)}
    </span>
  );
}

/** Homepage vendors strip — single row; click a vendor to open its minisite. */
export function HomeVendors({ vendors }: { vendors: Vendor[] }) {
  if (!vendors.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-2 md:px-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-ink">فروشندگان</h2>
      </div>
      <HScroller className="pb-1">
        {vendors.map((v) => (
          <Link
            key={v.id}
            href={`/${encodeURIComponent(v.englishName)}`}
            className="flex w-24 shrink-0 flex-col items-center gap-2 text-center"
          >
            <span className="h-20 w-20 overflow-hidden rounded-full border border-gold-200 bg-surface shadow-sm">
              <VendorAvatar vendor={v} />
            </span>
            <span className="line-clamp-2 w-24 text-xs font-medium leading-tight text-ink">
              {v.name}
            </span>
          </Link>
        ))}
      </HScroller>
    </section>
  );
}
