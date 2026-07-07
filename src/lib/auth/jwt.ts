/** Minimal JWT helpers — decode payload, read phone, check expiry. No verify. */

interface JwtPayload {
  preferred_username?: string;
  phone_number?: string;
  name?: string;
  exp?: number;
  [k: string]: unknown;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Phone number carried in the token (preferred_username / phone_number). */
export function phoneFromToken(token: string): string | null {
  const p = decodeJwt(token);
  return p?.preferred_username ?? p?.phone_number ?? p?.name ?? null;
}

/** True if the token is missing/expired (with a small skew margin). */
export function isTokenExpired(token: string, skewSeconds = 30): boolean {
  const p = decodeJwt(token);
  if (!p?.exp) return false; // can't tell → treat as valid
  return Date.now() / 1000 >= p.exp - skewSeconds;
}
