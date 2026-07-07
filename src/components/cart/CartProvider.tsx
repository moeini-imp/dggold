"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { CartLine, CartLineMeta } from "@/lib/types";

/**
 * Client-side cart. Tracks (productId, vendorId, quantity) lines only —
 * display details (title/price/image) are resolved from the data layer where
 * needed. Persisted to localStorage so it survives reloads. When a real
 * backend cart exists, this provider can sync lines to it.
 */

const STORAGE_KEY = "dg-cart-v1";

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | {
      type: "add";
      productId: string;
      vendorId: string;
      quantity?: number;
      meta?: CartLineMeta;
    }
  | { type: "setQty"; productId: string; vendorId: string; quantity: number }
  | { type: "remove"; productId: string; vendorId: string }
  | { type: "clear" };

function sameLine(l: CartLine, productId: string, vendorId: string) {
  return l.productId === productId && l.vendorId === vendorId;
}

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const qty = action.quantity ?? 1;
      const existing = state.find((l) =>
        sameLine(l, action.productId, action.vendorId),
      );
      if (existing) {
        return state.map((l) =>
          sameLine(l, action.productId, action.vendorId)
            ? { ...l, quantity: l.quantity + qty }
            : l,
        );
      }
      return [
        ...state,
        {
          productId: action.productId,
          vendorId: action.vendorId,
          quantity: qty,
          meta: action.meta,
        },
      ];
    }
    case "setQty": {
      if (action.quantity <= 0) {
        return state.filter(
          (l) => !sameLine(l, action.productId, action.vendorId),
        );
      }
      return state.map((l) =>
        sameLine(l, action.productId, action.vendorId)
          ? { ...l, quantity: action.quantity }
          : l,
      );
    }
    case "remove":
      return state.filter(
        (l) => !sameLine(l, action.productId, action.vendorId),
      );
    case "clear":
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  /** false until the persisted cart has loaded — avoids an empty-cart flash. */
  hydrated: boolean;
  totalCount: number;
  getQuantity: (productId: string, vendorId: string) => number;
  add: (
    productId: string,
    vendorId: string,
    quantity?: number,
    meta?: CartLineMeta,
  ) => void;
  setQty: (productId: string, vendorId: string, quantity: number) => void;
  remove: (productId: string, vendorId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [hydrated, setHydrated] = useState(false);

  // hydrate once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const getQuantity = useCallback(
    (productId: string, vendorId: string) =>
      lines.find((l) => sameLine(l, productId, vendorId))?.quantity ?? 0,
    [lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      hydrated,
      totalCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      getQuantity,
      add: (productId, vendorId, quantity, meta) =>
        dispatch({ type: "add", productId, vendorId, quantity, meta }),
      setQty: (productId, vendorId, quantity) =>
        dispatch({ type: "setQty", productId, vendorId, quantity }),
      remove: (productId, vendorId) =>
        dispatch({ type: "remove", productId, vendorId }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [lines, hydrated, getQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
