import { NextResponse } from "next/server";
import { WALLET_BASE_URL } from "@/lib/wallet/config";

const ALLOWED = new Set(["gold", "silver"]);

/** Proxy for wallet-api Payments/Buy/{asset}. Forwards the bearer token. */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ asset: string }> },
) {
  const { asset } = await ctx.params;
  if (!ALLOWED.has(asset)) {
    return NextResponse.json(
      { success: false, errorMessage: "دارایی نامعتبر است" },
      { status: 400 },
    );
  }

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
    const upstream = await fetch(`${WALLET_BASE_URL}/Payments/Buy/${asset}`, {
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
      { success: false, errorMessage: "خطا در ثبت خرید" },
      { status: 502 },
    );
  }
}
