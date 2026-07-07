import { NextResponse } from "next/server";
import { IDP_BASE_URL, OTP_SOURCE, OTP_SOURCE_ID } from "@/lib/auth/idp";

/**
 * Proxy for IDP OtpRequest. Keeps the call server-side (no browser CORS) and
 * lets us inject source/sourceId and, later, server-held secrets.
 */
export async function POST(req: Request) {
  let username = "";
  let source = OTP_SOURCE;
  let sourceId = OTP_SOURCE_ID;
  try {
    const body = await req.json();
    username = String(body?.username ?? "").trim();
    if (body?.source != null) source = Number(body.source);
    if (body?.sourceId != null) sourceId = Number(body.sourceId);
  } catch {
    return NextResponse.json(
      { success: false, errorMessage: "درخواست نامعتبر است" },
      { status: 400 },
    );
  }

  if (!/^09\d{9}$/.test(username)) {
    return NextResponse.json(
      { success: false, errorMessage: "شماره موبایل معتبر نیست" },
      { status: 422 },
    );
  }

  try {
    // Mirrors the IDP curl exactly: { username, source: 1, sourceId: 1 }
    const upstream = await fetch(`${IDP_BASE_URL}/Auth/OtpRequest`, {
      method: "POST",
      headers: { accept: "text/plain", "Content-Type": "application/json" },
      body: JSON.stringify({ username, source, sourceId }),
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
      { success: false, errorMessage: "خطا در ارتباط با سرور احراز هویت" },
      { status: 502 },
    );
  }
}
