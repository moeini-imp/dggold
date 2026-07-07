import { NextResponse } from "next/server";
import { SHOP_BASE_URL } from "@/lib/shop/config";

/** Proxy for shop-api GetCities?ProvinceId=. Forwards the caller's bearer token. */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth) {
    return NextResponse.json(
      { success: false, errorMessage: "احراز هویت لازم است" },
      { status: 401 },
    );
  }

  const provinceId = new URL(req.url).searchParams.get("provinceId");
  if (!provinceId) {
    return NextResponse.json(
      { success: false, errorMessage: "استان مشخص نشده است" },
      { status: 422 },
    );
  }

  try {
    const upstream = await fetch(
      `${SHOP_BASE_URL}/Place/GetCities?ProvinceId=${encodeURIComponent(provinceId)}`,
      {
        headers: { accept: "text/plain", Authorization: auth },
        cache: "no-store",
      },
    );
    const text = await upstream.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: upstream.ok, raw: text };
    }
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, errorMessage: "خطا در دریافت شهرها" },
      { status: 502 },
    );
  }
}
