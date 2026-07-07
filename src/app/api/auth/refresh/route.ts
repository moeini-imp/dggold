import { NextResponse } from "next/server";
import { IDP_BASE_URL } from "@/lib/auth/idp";

/** Proxy for IDP token refresh. Exchanges an expiring access/refresh pair. */
export async function POST(req: Request) {
  let username = "";
  let refreshToken = "";
  let accessToken = "";
  try {
    const body = await req.json();
    username = String(body?.username ?? "").trim();
    refreshToken = String(body?.refreshToken ?? "").trim();
    accessToken = String(body?.accessToken ?? "").trim();
  } catch {
    return NextResponse.json(
      { success: false, errorMessage: "درخواست نامعتبر است" },
      { status: 400 },
    );
  }

  if (!username || !refreshToken || !accessToken) {
    return NextResponse.json(
      { success: false, errorMessage: "اطلاعات نشست ناقص است" },
      { status: 422 },
    );
  }

  try {
    const upstream = await fetch(`${IDP_BASE_URL}/Auth/Refresh`, {
      method: "POST",
      headers: { accept: "text/plain", "Content-Type": "application/json" },
      body: JSON.stringify({ username, refreshToken, accessToken }),
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
