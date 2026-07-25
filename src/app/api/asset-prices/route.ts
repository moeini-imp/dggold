import { NextResponse } from "next/server";
import { getLastAssetPrices } from "@/lib/shop/assetPrice";

/**
 * Live asset prices for client-side polling (the home price bar refreshes
 * every minute without a page reload). Not cached — always fresh from upstream.
 */
export async function GET() {
  const prices = await getLastAssetPrices();
  if (!prices) {
    return NextResponse.json(
      { success: false, errorMessage: "خطا در دریافت قیمت‌ها" },
      { status: 502 },
    );
  }
  return NextResponse.json({ success: true, data: prices });
}
