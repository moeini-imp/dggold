/** Wallet backend base URL (server-side). Override via WALLET_BASE_URL env. */
export const WALLET_BASE_URL =
  process.env.WALLET_BASE_URL ?? "https://dg-nginx.darkube.ir/wallet";
