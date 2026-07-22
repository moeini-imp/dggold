/** Wallet ledger transactions (Financial/LedgerTransaction, per asset). */

export interface WalletTransaction {
  dateTime: string; // ISO
  mobile?: string;
  amountInToman: number;
  transactionType: string; // "واریز" (deposit) | "برداشت" (withdraw)
  memo: string;
  trackingCode: string;
}

export interface LedgerPage {
  items: WalletTransaction[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

type Raw = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Ledger transactions for one asset (assetTypeCode: IRR | XAU | XAG), paged.
 * Returns null on failure so callers can fall back to mock data.
 */
export async function getWalletTransactions(
  token: string,
  assetTypeCode: string,
  pageNumber = 1,
  pageSize = 20,
): Promise<LedgerPage | null> {
  const res = await fetch(
    `/api/wallet/transactions?assetTypeCode=${encodeURIComponent(
      assetTypeCode,
    )}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    { headers: { Authorization: `bearer ${token}` } },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as Raw | null;
  if (!json || !Array.isArray(json.items)) return null;
  return {
    items: (json.items as Raw[]).map((t) => ({
      dateTime: String(t.dateTime ?? ""),
      mobile: t.mobile ? String(t.mobile) : undefined,
      amountInToman: num(t.amountInToman),
      transactionType: String(t.transactionType ?? ""),
      memo: String(t.memo ?? ""),
      trackingCode: String(t.trackingCode ?? ""),
    })),
    pageNumber: num(json.pageNumber) || pageNumber,
    totalPages: Math.max(1, num(json.totalPages) || 1),
    totalCount: num(json.totalCount),
    totalDeposits: num(json.totalDeposits),
    totalWithdrawals: num(json.totalWithdrawals),
  };
}

/** Sample ledger page so the list/detail UI is reviewable before wiring. */
export function buildMockTransactions(): LedgerPage {
  return {
    items: [
      {
        dateTime: "2026-07-22T06:54:12",
        amountInToman: 18611,
        transactionType: "واریز",
        memo: "لغو پرداخت درگاه توسط کاربر - برگشت وجه به کیف پول ریالی",
        trackingCode: "4b170f87-c391-4948-9468-777cc62d7160_wallet_cancel_reversal",
      },
      {
        dateTime: "2026-07-22T06:38:38",
        amountInToman: 18611,
        transactionType: "برداشت",
        memo: "پرداخت هزینه ارسال فیزیکی سفارش - روش ارسال: پست",
        trackingCode: "e697fd9f-5e3d-468e-8912-d065bbce9d4d",
      },
      {
        dateTime: "2026-07-21T12:14:33",
        amountInToman: 96973.8,
        transactionType: "واریز",
        memo: "سهم فروشنده بابت سفارش (پس از کسر ۳٪ کارمزد)",
        trackingCode: "VendorShare-77b3e0c8-4303-46ec-9b55-84e75452aeb2-4",
      },
    ],
    pageNumber: 1,
    totalPages: 1,
    totalCount: 3,
    totalDeposits: 115584.8,
    totalWithdrawals: 18611,
  };
}
