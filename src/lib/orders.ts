"use client";

import type { Order } from "@/lib/types";

/**
 * Client-side order history (localStorage). Stands in for a backend orders
 * endpoint: replace these with API calls when the backend is ready. The
 * checkout writes here on success; the account "سفارش‌های من" reads from it.
 */
const STORAGE_KEY = "dg-orders-v1";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function getOrder(code: string): Order | undefined {
  return getOrders().find((o) => o.code === code);
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  const all = getOrders();
  // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...all]));
}

/** Generate a short human-friendly order code, e.g. "DG-4821093". */
export function generateOrderCode(): string {
  const n = Math.floor(1_000_000 + Math.random() * 9_000_000);
  return `DG-${n}`;
}
