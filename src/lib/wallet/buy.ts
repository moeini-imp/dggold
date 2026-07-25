/** Granule purchase via our proxy (forwards the bearer token). */

export interface BuyGranulePayload {
  assetCode: string; // asset paid WITH — "IRR"
  gatewayId: number; // payment gateway id
  productCategory: number; // always 1 for now
  productSymbol: number; // 1 = GOLD24, 2 = GOLD18
  productGrossAmountInMg: number; // amount of granule in mg (= سوت)
  clientUnitPrice: number; // live per-gram price (Toman) of that symbol
  nationalCode?: string; // کد ملی — required by the Baloan credit gateway
}

/**
 * On SUCCESS the API returns this intent object directly (no envelope).
 * `redirectUrl`/`redirectMethod`/`formFields` drive the same gateway hand-off
 * as product checkout. `walletPaidAmount`/`gatewayAmount` split the total
 * between wallet and gateway (gateway-only for now).
 */
export interface BuyIntent {
  paymentIntentId?: string;
  status?: string;
  amount?: number;
  walletPaidAmount?: number;
  gatewayAmount?: number;
  assetCode?: string;
  redirectUrl?: string;
  redirectMethod?: "GET" | "POST" | string;
  formFields?: Record<string, string>;
  createdAtUtc?: string;
}

export interface BuyGranuleResponse {
  ok: boolean;
  intent?: BuyIntent;
  errorMessage?: string;
}

/**
 * Buy gold/silver granule. Normalizes the two response shapes:
 *  - success → the intent object itself (may carry a gateway redirect)
 *  - failure → `{ success:false, errorMessage }`
 */
export async function buyGranule(
  token: string,
  asset: "gold" | "silver",
  payload: BuyGranulePayload,
): Promise<BuyGranuleResponse> {
  const res = await fetch(`/api/wallet/buy/${asset}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let raw: Record<string, unknown> | null = null;
  try {
    raw = (await res.json()) as Record<string, unknown>;
  } catch {
    raw = null;
  }

  // explicit failure envelope
  if (raw && raw.success === false) {
    return {
      ok: false,
      errorMessage:
        (raw.errorMessage as string) || (raw.resultMessage as string) || undefined,
    };
  }
  // wrapped success: { success: true, data: { …intent } }
  if (raw && raw.success === true && raw.data) {
    return { ok: true, intent: raw.data as unknown as BuyIntent };
  }
  // unwrapped success (older shape): the intent object itself at top level
  if (res.ok && raw && (raw.redirectUrl || raw.paymentIntentId)) {
    return { ok: true, intent: raw as unknown as BuyIntent };
  }
  return {
    ok: false,
    errorMessage: (raw?.errorMessage as string) || undefined,
  };
}

export interface SellGranulePayload {
  productGrossAmountInMg: number; // سوت
  clientUnitPrice: number; // live per-gram price (Toman)
}

export interface SellGranuleResponse {
  ok: boolean;
  totalAmountInToman?: number;
  executedGrossAmountInMg?: number;
  status?: string;
  errorMessage?: string;
}

/** Sell granule — instant (no gateway); credits the rial wallet. */
export async function sellGranule(
  token: string,
  asset: "gold" | "silver",
  payload: SellGranulePayload,
): Promise<SellGranuleResponse> {
  const res = await fetch(`/api/wallet/sell/${asset}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let raw: Record<string, unknown> | null = null;
  try {
    raw = (await res.json()) as Record<string, unknown>;
  } catch {
    raw = null;
  }

  if (raw && raw.success === true && raw.data) {
    const d = raw.data as Record<string, unknown>;
    return {
      ok: true,
      totalAmountInToman: Number(d.totalAmountInToman) || 0,
      executedGrossAmountInMg: Number(d.executedGrossAmountInMg) || 0,
      status: String(d.status ?? ""),
    };
  }
  return {
    ok: false,
    errorMessage: (raw?.errorMessage as string) || undefined,
  };
}
