/**
 * Identity provider (IDP) config — server-side only.
 * Base URL is overridable via env so we can point at staging/prod later.
 */
export const IDP_BASE_URL =
  process.env.IDP_BASE_URL ?? "https://dg-nginx.darkube.ir/idp";

// Channel the OTP is requested through (provided by backend).
export const OTP_SOURCE = 1;
export const OTP_SOURCE_ID = 1;
