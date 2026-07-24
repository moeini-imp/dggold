"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  formatToman,
  persianError,
  toEnglishDigits,
  toPersianDigits,
} from "@/lib/format";
import { baloanSendOtp, baloanSettle } from "@/lib/wallet/baloan";

const RESEND_SECONDS = 90;

/**
 * Baloan OTP page — the user lands here after the (uniform) gateway redirect:
 * `{FRONT}/baloan/checkout?paymentIntentId=…&amount=…`.
 *
 * The wallet already verified the user's Baloan credit and sent the first OTP
 * while creating the payment, so all that's left is: enter the code → settle.
 * Settle is the "returned from the gateway" step — it drives the ledger
 * settlement and publishes the order as paid.
 *
 * OTP is only ever sent from a click handler (never an effect) so React 19
 * StrictMode / re-mounts can't fire duplicate SMS. The OTP lives in component
 * state only; the national id never leaves the server (read from the token).
 */
export function BaloanCheckout({
  paymentIntentId,
  amountToman,
}: {
  paymentIntentId: string;
  amountToman: number;
}) {
  const router = useRouter();
  const { accessToken, isAuthenticated, hydrated } = useAuth();

  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  // Auth-guard the page: bounce unauthenticated users to login and back.
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      const back = encodeURIComponent(
        `/baloan/checkout?paymentIntentId=${paymentIntentId}`,
      );
      router.replace(`/login?redirect=${back}`);
    }
  }, [hydrated, isAuthenticated, paymentIntentId, router]);

  // Resend cooldown ticker (starts counting from arrival — the first OTP was
  // already sent server-side).
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const otpValid = otp.length >= 4;

  async function handleResend() {
    if (!accessToken || busy || cooldown > 0) return;
    setBusy(true);
    setError("");
    setNotice("");

    const s = await baloanSendOtp(accessToken, paymentIntentId);
    if (!s.ok) {
      setError(persianError(s.errorMessage, "ارسال مجدد کد ناموفق بود."));
      setBusy(false);
      return;
    }
    setNotice("کد تایید مجدداً ارسال شد.");
    setCooldown(RESEND_SECONDS);
    setBusy(false);
  }

  async function handleSettle() {
    if (!accessToken || !otpValid || busy) return;
    setBusy(true);
    setError("");
    setNotice("");

    const r = await baloanSettle(accessToken, paymentIntentId, otp);

    // A network/proxy failure is ambiguous: credit MAY have been captured for
    // this intent. Stay on this screen and let the user retry the SAME intent —
    // never send them back to create a new order.
    if (!r.ok || !r.outcome) {
      setError(
        persianError(
          r.errorMessage,
          "وضعیت پرداخت نامشخص است. لطفاً چند لحظه صبر کنید و دوباره «پرداخت» را بزنید.",
        ),
      );
      setBusy(false);
      return;
    }

    const { status, message } = r.outcome;

    if (status === "Succeeded" || status === "AlreadySucceeded") {
      router.replace(`/receipt/success?id=${paymentIntentId}`);
      return; // keep busy = true through navigation
    }

    if (status === "OtpInvalid") {
      // Also the normal follow-up to a Pending retry: the previous code was
      // consumed, so allow an immediate resend rather than treating it as final.
      setOtp("");
      setCooldown(0);
      setError(
        message ||
          "کد تایید نامعتبر است یا منقضی شده. کد جدید بگیرید و دوباره تلاش کنید.",
      );
      setBusy(false);
      return;
    }

    if (status === "Pending") {
      // Baloan may already have captured — retry HERE only, do not re-order.
      setError(
        message ||
          "وضعیت تسویه نامشخص است. لطفاً چند لحظه صبر کنید و دوباره «پرداخت» را بزنید. سفارش جدید ثبت نکنید.",
      );
      setBusy(false);
      return;
    }

    // Failed / unknown
    setError(message || "پرداخت با بالون ناموفق بود.");
    setBusy(false);
  }

  // Invalid entry (e.g. opened without an intent id) — nothing to settle.
  if (!paymentIntentId) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="mb-4 text-sm text-muted">
          شناسه پرداخت نامعتبر است. لطفاً دوباره از سبد خرید اقدام کنید.
        </p>
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="rounded-btn bg-teal-600 px-6 py-2.5 text-sm font-bold text-surface transition hover:bg-teal-700"
        >
          بازگشت به سبد خرید
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-card border border-line bg-surface p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-bold text-ink">پرداخت اعتباری بالون</h1>
        <p className="mb-5 text-sm text-muted">
          کد تایید به شماره موبایل ثبت‌شده در بالون پیامک شد. برای تکمیل پرداخت،
          کد را وارد کنید.
        </p>

        {amountToman > 0 ? (
          <div className="mb-4 flex items-center justify-between rounded-btn bg-canvas px-4 py-3 text-sm">
            <span className="text-muted">مبلغ قابل پرداخت</span>
            <span className="font-bold text-ink tnum">
              {formatToman(amountToman)}
            </span>
          </div>
        ) : null}

        <label className="mb-2 block">
          <span className="mb-1.5 block text-sm font-medium text-ink">کد تایید</span>
          <input
            value={toPersianDigits(otp)}
            onChange={(e) =>
              setOtp(toEnglishDigits(e.target.value).replace(/\D/g, "").slice(0, 8))
            }
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            placeholder="کد پیامک‌شده"
            className="w-full rounded-btn border border-line bg-canvas px-4 py-3 text-center text-lg tracking-widest outline-none transition focus:border-teal-400 tnum"
          />
        </label>

        {error ? (
          <p className="mb-3 text-sm text-danger">{error}</p>
        ) : notice ? (
          <p className="mb-3 text-sm text-teal-700">{notice}</p>
        ) : null}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSettle}
            disabled={!otpValid || busy}
            className="w-full rounded-btn bg-teal-600 px-6 py-3 text-sm font-bold text-surface transition hover:bg-teal-700 disabled:opacity-50"
          >
            {busy ? "در حال پرداخت…" : "پرداخت"}
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={busy || cooldown > 0}
            className="w-full rounded-btn border border-line px-6 py-2.5 text-sm font-medium text-ink transition hover:bg-canvas disabled:opacity-50"
          >
            {cooldown > 0
              ? `ارسال مجدد کد (${toPersianDigits(String(cooldown))})`
              : "ارسال مجدد کد"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.push("/cart")}
          disabled={busy}
          className="mt-4 block w-full text-center text-xs text-muted transition hover:text-ink disabled:opacity-50"
        >
          انصراف و بازگشت
        </button>
      </div>
    </div>
  );
}
