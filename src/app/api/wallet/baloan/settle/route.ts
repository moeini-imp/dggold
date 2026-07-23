import { forwardBaloan } from "@/lib/wallet/baloanProxy";

/** Proxy for wallet-api Payments/BaloanSettle. Forwards the bearer token. */
export function POST(req: Request) {
  return forwardBaloan(req, "/Payments/BaloanSettle");
}
