import type { Metadata } from "next";
import { OrdersHistoryView } from "@/components/profile/OrdersHistoryView";

export const metadata: Metadata = {
  title: "سفارش‌های من | دیجی گلد",
};

export default function OrdersPage() {
  return <OrdersHistoryView />;
}
