import { forwardBaloanSettle } from "@/lib/wallet/baloanProxy";

/**
 * Proxy for wallet-api Payments/BaloanSettle. That endpoint replies like a
 * gateway callback (302 → receipt page), so we capture the redirect instead of
 * following it. Forwards the bearer token.
 */
export function POST(req: Request) {
  return forwardBaloanSettle(req);
}
