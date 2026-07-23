import { forwardBaloan } from "@/lib/wallet/baloanProxy";

/** Proxy for wallet-api Payments/BaloanCheckCredit. Forwards the bearer token. */
export function POST(req: Request) {
  return forwardBaloan(req, "/Payments/BaloanCheckCredit");
}
