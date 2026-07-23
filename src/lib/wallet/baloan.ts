/**
 * Baloan credit gateway (on-site BNPL / OTP) client — talks to our wallet
 * proxy, which forwards the bearer token to the wallet API. Unlike redirect
 * gateways, Baloan has no hosted page: the user enters their national id and
 * an SMS OTP here, and we settle server-to-server.
 *
 * Flow: check-credit → send-otp → settle. All amounts are Toman.
 */

/** Wallet PaymentGateway enum value for Baloan (the stable discriminator). */
export const BALOAN_GATEWAY_CODE = 16;

/** sessionStorage key holding the in-flight Baloan intent id (id only, not PII). */
export const BALOAN_RESUME_KEY = "baloan_pending_intent";

export interface BaloanCreditInfo {
  userCreditToman: number;
  requiredToman: number;
  sufficient: boolean;
}

/** status ∈ Succeeded | AlreadySucceeded | OtpInvalid | Failed | Pending */
export interface BaloanSettleOutcome {
  status: string;
  success: boolean;
  message?: string;
}

async function postBaloan(
  path: string,
  token: string,
  body: unknown,
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`/api/wallet/baloan/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Read the Persian error out of a DataResult-style envelope. */
function envelopeError(raw: Record<string, unknown> | null): string | undefined {
  return (
    (raw?.errorMessage as string) ||
    (raw?.resultMessage as string) ||
    undefined
  );
}

export async function baloanCheckCredit(
  token: string,
  paymentIntentId: string,
  nationalIdentifier: string,
): Promise<{ ok: boolean; info?: BaloanCreditInfo; errorMessage?: string }> {
  const raw = await postBaloan("check-credit", token, {
    paymentIntentId,
    nationalIdentifier,
  });
  if (raw && raw.success === true && raw.data) {
    const d = raw.data as Record<string, unknown>;
    return {
      ok: true,
      info: {
        userCreditToman: num(d.userCreditToman),
        requiredToman: num(d.requiredToman),
        sufficient: d.sufficient === true,
      },
    };
  }
  return { ok: false, errorMessage: envelopeError(raw) };
}

export async function baloanSendOtp(
  token: string,
  paymentIntentId: string,
  nationalIdentifier: string,
): Promise<{ ok: boolean; errorMessage?: string }> {
  const raw = await postBaloan("send-otp", token, {
    paymentIntentId,
    nationalIdentifier,
  });
  if (raw && raw.success === true) return { ok: true };
  return { ok: false, errorMessage: envelopeError(raw) };
}

export async function baloanSettle(
  token: string,
  paymentIntentId: string,
  nationalIdentifier: string,
  otp: string,
): Promise<{ ok: boolean; outcome?: BaloanSettleOutcome; errorMessage?: string }> {
  const raw = await postBaloan("settle", token, {
    paymentIntentId,
    nationalIdentifier,
    otp,
  });
  if (raw && raw.success === true && raw.data) {
    const d = raw.data as Record<string, unknown>;
    return {
      ok: true,
      outcome: {
        status: String(d.status ?? ""),
        success: d.success === true,
        message: (d.message as string) ?? undefined,
      },
    };
  }
  return { ok: false, errorMessage: envelopeError(raw) };
}
