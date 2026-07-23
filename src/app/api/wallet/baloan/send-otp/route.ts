import { forwardBaloan } from "@/lib/wallet/baloanProxy";

/** Proxy for wallet-api Payments/BaloanSendOtp. Forwards the bearer token. */
export function POST(req: Request) {
  return forwardBaloan(req, "/Payments/BaloanSendOtp");
}
