import type { Metadata } from "next";
import { OrderDetailView } from "@/components/profile/OrderDetailView";

export const metadata: Metadata = {
  title: "جزئیات سفارش | دیجی گلد",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailView orderId={id} />;
}
