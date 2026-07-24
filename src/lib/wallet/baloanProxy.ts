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

/**
 * Settle forwarder. The wallet's BaloanSettle responds like a gateway callback —
 * an HTTP 302 redirect to the receipt page (success/failed) — NOT JSON. We must
 * NOT follow it (that would fetch the receipt HTML); instead we capture the
 * Location and hand it back as JSON so the page can navigate the browser there.
 *
 * Inconclusive outcomes (invalid OTP, pending) come back as a 4xx/5xx JSON body
 * with an error message; those are passed straight through so the page can let
 * the user retry. A JSON 200 (older wallet build) is also passed through.
 */
export async function forwardBaloanSettle(req: Request): Promise<NextResponse> {
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
    const upstream = await fetch(`${WALLET_BASE_URL}/Payments/BaloanSettle`, {
      method: "POST",
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "manual", // don't follow — we want the Location, not the receipt HTML
    });

    // Success/failed → 3xx redirect to the receipt page.
    const location = upstream.headers.get("location");
    if (upstream.status >= 300 && upstream.status < 400 && location) {
      return NextResponse.json({ success: true, data: { redirectUrl: location } });
    }

    // Otherwise: JSON (200 legacy) or an error body (inconclusive) — pass through.
    const text = await upstream.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: upstream.ok, raw: text };
    }
    return NextResponse.json(data, { status: upstream.status || 200 });
  } catch {
    return NextResponse.json(
      { success: false, errorMessage: "خطا در ارتباط با درگاه بالون" },
      { status: 502 },
    );
  }
}
