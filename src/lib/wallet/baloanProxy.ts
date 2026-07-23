import { NextResponse } from "next/server";
import { WALLET_BASE_URL } from "@/lib/wallet/config";

/**
 * Shared server-side forwarder for the Baloan credit endpoints.
 * Mirrors the other wallet proxies (e.g. api/wallet/buy): requires a bearer
 * token, forwards the JSON body to the wallet API, and passes the upstream
 * response (and status) straight back. National id / OTP travel only in the
 * request body — never in a URL/query — and nothing is logged here.
 */
export async function forwardBaloan(
  req: Request,
  endpoint: string,
): Promise<NextResponse> {
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
    const upstream = await fetch(`${WALLET_BASE_URL}${endpoint}`, {
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
      { success: false, errorMessage: "خطا در ارتباط با درگاه بالون" },
      { status: 502 },
    );
  }
}
