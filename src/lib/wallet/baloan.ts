/**
 * Baloan credit gateway (on-site BNPL / OTP) client — talks to our wallet proxy,
 * which forwards the bearer token to the wallet API.
 *
 * The credit check and the FIRST OTP happen server-side while the payment is
 * created (the wallet does them inside GeneratePaymentUrl before redirecting
 * here), so this page only needs to: resend an OTP, and settle.
 *
 * The national id is never sent from the client — the wallet reads it from the
 * user's token claim.
 */

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

/** Read the Persian error out of a DataResult-style envelope. */
function envelopeError(raw: Record<string, unknown> | null): string | undefined {
  return (
    (raw?.errorMessage as string) ||
    (raw?.resultMessage as string) ||
    undefined
  );
}

/** Resend the OTP (the first one was sent when the payment was created). */
export async function baloanSendOtp(
  token: string,
  paymentIntentId: string,
): Promise<{ ok: boolean; errorMessage?: string }> {
  const raw = await postBaloan("send-otp", token, { paymentIntentId });
  if (raw && raw.success === true) return { ok: true };
  return { ok: false, errorMessage: envelopeError(raw) };
}

export async function baloanSettle(
  token: string,
  paymentIntentId: string,
  otp: string,
): Promise<{ ok: boolean; outcome?: BaloanSettleOutcome; errorMessage?: string }> {
  const raw = await postBaloan("settle", token, { paymentIntentId, otp });
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
