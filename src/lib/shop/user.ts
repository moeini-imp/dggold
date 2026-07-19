/** Current user's profile info (client-side; needs the auth bearer token). */

export interface ShopUserInfo {
  fullName: string | null;
  avatarUrl: string | null;
}

type Raw = Record<string, unknown>;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Best-effort profile fetch — the backend response shape for this endpoint
 * hasn't been observed with a real session, so this reads several plausible
 * field names and returns nulls (never throws) when none are present, so
 * callers can fall back to the phone number from the JWT.
 */
export async function getUserInfo(token: string): Promise<ShopUserInfo> {
  try {
    const res = await fetch("/api/users/info", {
      headers: { Authorization: `bearer ${token}` },
    });
    const json = (await res.json()) as { success?: boolean; data?: unknown };
    if (!json?.success || !json.data || typeof json.data !== "object") {
      return { fullName: null, avatarUrl: null };
    }
    const d = json.data as Raw;
    const first = str(d.firstName);
    const last = str(d.lastName);
    const fullName =
      str(d.fullName) ||
      str(d.name) ||
      (first || last ? `${first} ${last}`.trim() : "") ||
      null;
    const avatarUrl = str(d.avatarUrl) || str(d.imageUrl) || str(d.avatar) || null;
    return { fullName, avatarUrl };
  } catch {
    return { fullName: null, avatarUrl: null };
  }
}
