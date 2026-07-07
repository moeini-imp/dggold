"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "@/components/ui/icons";

/** Back button shown on every page except home. RTL: points right. */
export function HeaderBack() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/") return null;
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="بازگشت"
      className="grid h-10 w-10 place-items-center rounded-full text-ink/80 transition hover:bg-canvas hover:text-teal-700"
    >
      <ChevronRight className="h-6 w-6" />
    </button>
  );
}
