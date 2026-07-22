/** Wallet overview via our proxy (forwards the bearer token). */

export interface AssetBalance {
  assetCode: string; // XAU (gold) | XAG (silver) | IRR (rial)
  amount: number;
}

export interface SubWallet {
  accountId: string;
  assetCode: string;
  balance: number;
}

export interface WalletOverview {
  walletId: string;
  userId: number;
  totalBalances: AssetBalance[];
  subWallets: SubWallet[];
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Fetch the user's wallet overview (Wallets/GetWalletOverview, authed).
 * Returns null on failure so the page can fall back to an empty mock wallet.
 */
export async function getWalletOverview(
  token: string,
): Promise<WalletOverview | null> {
  const res = await fetch("/api/wallet/overview", {
    headers: { Authorization: `bearer ${token}` },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: Raw } | null;
  const d = json?.data;
  if (!d) return null;
  return {
    walletId: String(d.walletId ?? ""),
    userId: num(d.userId),
    totalBalances: Array.isArray(d.totalBalances)
      ? (d.totalBalances as Raw[]).map((b) => ({
          assetCode: String(b.assetCode ?? ""),
          amount: num(b.amount),
        }))
      : [],
    subWallets: Array.isArray(d.subWallets)
      ? (d.subWallets as Raw[]).map((s) => ({
          accountId: String(s.accountId ?? ""),
          assetCode: String(s.assetCode ?? ""),
          balance: num(s.balance),
        }))
      : [],
  };
}

/** Look up a single asset's balance from the overview's totals. */
export function assetAmount(overview: WalletOverview, code: string): number {
  return (
    overview.totalBalances.find((b) => b.assetCode === code)?.amount ??
    overview.subWallets.find((s) => s.assetCode === code)?.balance ??
    0
  );
}

/** Empty wallet (same shape) for when the API is unreachable. */
export function buildMockWalletOverview(): WalletOverview {
  return {
    walletId: "mock",
    userId: 0,
    totalBalances: [
      { assetCode: "XAU", amount: 0 },
      { assetCode: "XAG", amount: 0 },
      { assetCode: "IRR", amount: 0 },
    ],
    subWallets: [],
  };
}
