/** Client-side auth calls (hit our own Next route handlers, not the IDP directly). */

export interface OtpRequestData {
  otpRequired: boolean;
  success: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
  userName: string | null;
  message: string | null;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  resultMessage: string | null;
  errorCode: string | null;
  errorMessage: string | null;
}

/** Request an OTP for the given phone number (normalized 09xxxxxxxxx). */
export async function requestOtp(
  username: string,
): Promise<ApiEnvelope<OtpRequestData>> {
  const res = await fetch("/api/auth/otp-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // source/sourceId are required by the IDP — both 1.
    body: JSON.stringify({ username, source: 1, sourceId: 1 }),
  });
  return (await res.json()) as ApiEnvelope<OtpRequestData>;
}

/** Verify the OTP code and obtain tokens. */
export async function verifyOtp(
  username: string,
  code: string,
): Promise<ApiEnvelope<OtpRequestData>> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, code, source: 1, sourceId: 1 }),
  });
  return (await res.json()) as ApiEnvelope<OtpRequestData>;
}

/** Exchange an expiring token pair for a fresh one. */
export async function refreshSession(
  username: string,
  refreshToken: string,
  accessToken: string,
): Promise<ApiEnvelope<OtpRequestData>> {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, refreshToken, accessToken }),
  });
  return (await res.json()) as ApiEnvelope<OtpRequestData>;
}
