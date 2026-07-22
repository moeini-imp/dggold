/** Order creation (via our proxy, which forwards the bearer token). */

/** A slice of the order paid from a wallet sub-account (ledger account). */
export interface WalletAllocation {
  ledgerAccountId: string; // wallet overview subWallets[].accountId
  amount: number;
  assetCode: string; // "IRR" | "XAU" | "XAG"
}

export interface AddOrderPayload {
  addressId: number;
  shippingTypeId: number;
  idempotencyKey: string;
  /** Optional buyer note entered on the checkout page. */
  buyerComment: string;
  paymentGatewayId: number;
  callbackUrl: string;
  products: { id: number; quantity: number }[];
  /** Amounts drawn from the user's wallet balances (rial / gold). */
  walletAllocations?: WalletAllocation[];
}

export interface AddOrderData {
  paymentIntentId: string;
  status: string;
  amount: number;
  /** Where to send the user to complete payment. */
  redirectUrl: string;
  /** "GET" → navigate directly. "POST" → submit `formFields` as a form. */
  redirectMethod: "GET" | "POST" | string;
  /** Hidden form fields required when redirectMethod is "POST" (e.g. تارا). */
  formFields: Record<string, string>;
  createdAtUtc?: string;
}

export interface AddOrderResult {
  success: boolean;
  data: AddOrderData | null;
  resultMessage?: string | null;
  errorMessage?: string | null;
}

/** Create an order; returns the payment gateway URL to redirect the user to. */
export async function addOrder(
  token: string,
  payload: AddOrderPayload,
): Promise<AddOrderResult> {
  const res = await fetch("/api/order/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as AddOrderResult;
}
