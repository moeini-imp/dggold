import { SHOP_BASE_URL } from "@/lib/shop/config";

/**
 * Server-side fetch to the shop API with a couple of retries. The upstream
 * occasionally drops the TLS socket under concurrent requests
 * ("socket disconnected before secure TLS connection"), so we retry briefly.
 * Returns parsed JSON, or null on persistent failure.
 */
async function shopFetchJson(
  path: string,
  init: RequestInit,
  attempts = 3,
): Promise<unknown | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${SHOP_BASE_URL}${path}`, {
        ...init,
        cache: "no-store", // always fresh so new content shows immediately
        // fail fast instead of hanging on a stalled TLS handshake
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return null;
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    } catch (e) {
      if (i === attempts - 1) {
        console.error(
          `[shop] ${path} failed:`,
          String((e as { cause?: unknown })?.cause ?? e),
        );
        return null;
      }
      await new Promise((r) => setTimeout(r, 200 * (i + 1)));
    }
  }
  return null;
}

export function shopGetJson(
  path: string,
  opts: { attempts?: number } = {},
): Promise<unknown | null> {
  return shopFetchJson(path, { headers: { accept: "text/plain" } }, opts.attempts);
}

export function shopPostJson(
  path: string,
  body?: unknown,
  opts: { attempts?: number } = {},
): Promise<unknown | null> {
  return shopFetchJson(
    path,
    {
      method: "POST",
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: body == null ? "" : JSON.stringify(body),
    },
    opts.attempts,
  );
}
