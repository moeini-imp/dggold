import { NextResponse } from "next/server";
import { SHOP_BASE_URL } from "@/lib/shop/config";

/** Proxy for shop-api Address/CreateEdit. Forwards the caller's bearer token. */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth) {
    return NextResponse.json(
      { success: false, errorMessage: "احراز هویت لازم است" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, errorMessage: "درخواست نامعتبر است" },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(`${SHOP_BASE_URL}/Address/CreateEdit`, {
      method: "POST",
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
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
      { success: false, errorMessage: "خطا در ذخیره آدرس" },
      { status: 502 },
    );
  }
}
