import { NextResponse } from "next/server";
import { IDP_BASE_URL, OTP_SOURCE, OTP_SOURCE_ID } from "@/lib/auth/idp";

/**
 * Proxy for IDP Login (OTP verify). Verifies the code and returns tokens.
 * Server-side to avoid CORS and to keep the IDP base configurable.
 */
export async function POST(req: Request) {
  let username = "";
  let code = "";
  let source = OTP_SOURCE;
  let sourceId = OTP_SOURCE_ID;
  try {
    const body = await req.json();
    username = String(body?.username ?? "").trim();
    code = String(body?.code ?? "").trim();
    if (body?.source != null) source = Number(body.source);
    if (body?.sourceId != null) sourceId = Number(body.sourceId);
  } catch {
    return NextResponse.json(
      { success: false, errorMessage: "درخواست نامعتبر است" },
      { status: 400 },
    );
  }

  if (!/^09\d{9}$/.test(username) || !/^\d{4,6}$/.test(code)) {
    return NextResponse.json(
      { success: false, errorMessage: "اطلاعات ورود نامعتبر است" },
      { status: 422 },
    );
  }

  try {
    // Mirrors the IDP curl: { username, code, source: 1, sourceId: 1 }
    const upstream = await fetch(`${IDP_BASE_URL}/Auth/Login`, {
      method: "POST",
      headers: { accept: "text/plain", "Content-Type": "application/json" },
      body: JSON.stringify({ username, code, source, sourceId }),
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
