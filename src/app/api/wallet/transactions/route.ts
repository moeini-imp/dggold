import { NextResponse } from "next/server";
import { WALLET_BASE_URL } from "@/lib/wallet/config";

/** Proxy for wallet-api Financial/LedgerTransaction. Forwards the bearer token. */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth) {
    return NextResponse.json(
      { success: false, errorMessage: "احراز هویت لازم است" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const asset = url.searchParams.get("assetTypeCode") ?? "IRR";
  const pageNumber = url.searchParams.get("pageNumber") ?? "1";
  const pageSize = url.searchParams.get("pageSize") ?? "20";

  try {
    const upstream = await fetch(
      `${WALLET_BASE_URL}/Financial/LedgerTransaction?assetTypeCode=${encodeURIComponent(
        asset,
      )}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      { headers: { accept: "text/plain", Authorization: auth }, cache: "no-store" },
    );
    const text = await upstream.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { errorMessage: "خطا در دریافت تراکنش‌ها" },
      { status: 502 },
    );
  }
}
