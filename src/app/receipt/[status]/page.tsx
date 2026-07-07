import { Suspense } from "react";
import type { Metadata } from "next";
import { ReceiptView } from "@/components/checkout/ReceiptView";

export const metadata: Metadata = {
  title: "نتیجه پرداخت | دیجی گلد",
};

function normalizeStatus(raw: string): "success" | "failed" | "pending" {
  const s = raw.toLowerCase();
  if (["success", "ok", "paid", "succeed"].includes(s)) return "success";
  if (["failed", "fail", "error", "canceled", "cancelled"].includes(s))
    return "failed";
  return "pending";
}

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status } = await params;
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted">در حال بارگذاری…</div>
      }
    >
      <ReceiptView status={normalizeStatus(status)} />
    </Suspense>
  );
}
