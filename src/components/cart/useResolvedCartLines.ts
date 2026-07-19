"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { resolveCartLines } from "@/lib/api";
import type { CartDisplayLine } from "@/lib/types";

/** Cart lines joined to display data (title/price/image/vendor). Shared by
 *  the full cart page and the cart modal so both stay in sync. */
export function useResolvedCartLines(): CartDisplayLine[] {
  const { lines } = useCart();
  const [details, setDetails] = useState<CartDisplayLine[]>([]);

  useEffect(() => {
    let active = true;
    resolveCartLines(lines).then((d) => {
      if (active) setDetails(d);
    });
    return () => {
      active = false;
    };
  }, [lines]);

  return details;
}
