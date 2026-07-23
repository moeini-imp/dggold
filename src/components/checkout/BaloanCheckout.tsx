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
import {
  BALOAN_RESUME_KEY,
  baloanCheckCredit,
  baloanSendOtp,
  baloanSettle,
  type BaloanCreditInfo,
} from "@/lib/wallet/baloan";

const RESEND_SECONDS = 90;
const NATIONAL_ID = /^\d{10}$/;

/**
 * On-site Baloan credit checkout. Baloan has no hosted redirect page: the user
 * enters their national id, we check credit + send an SMS OTP, they enter it,
 * and we settle server-to-server against the already-created payment intent.
 *
 * OTP is only ever sent from a click handler (never an effect) so React 19
 * StrictMode / re-mounts can't fire duplicate SMS. National id and OTP live in
 * component state only — never in the URL, storage, or logs.
 */
export function BaloanCheckout({
  paymentIntentId,
  onCancel,
}: {
  paymentIntentId: string;
  onCancel: () => void;
}) {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [step, setStep] = useState<"id" | "otp">("id");
  const [nationalId, setNationalId] = useState("");
  const [otp, setOtp] = useState("");
  const [credit, setCredit] = useState<BaloanCreditInfo | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Remember the intent id (only the id) so a reload can resume here.
  useEffect(() => {
    try {
      sessionStorage.setItem(BALOAN_RESUME_KEY, paymentIntentId);
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [paymentIntentId]);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const idValid = NATIONAL_ID.test(nationalId);
  const otpValid = otp.length >= 4;

  function clearResume() {
    try {
      sessionStorage.removeItem(BALOAN_RESUME_KEY);
    } catch {
      /* ignore */
    }
  }

  async function handleCheckAndSend() {
    if (!accessToken || !idValid || busy) return;
    setBusy(true);
    setError("");
    setNotice("");

    const c = await baloanCheckCredit(accessToken, paymentIntentId, nationalId);
    if (!c.ok || !c.info) {
      setError(
        persianError(c.errorMessage, "استعلام اعتبار ناموفق بود. دوباره تلاش کنید."),
      );
      setBusy(false);
      return;
    }
    setCredit(c.info);
    if (!c.info.sufficient) {
      setError(
        `اعتبار بالون شما کافی نیست. اعتبار شما ${formatToman(
          c.info.userCreditToman,
        )} و مبلغ لازم ${formatToman(c.info.requiredToman)} است.`,
      );
      setBusy(false);
      return;
    }

    const s = await baloanSendOtp(accessToken, paymentIntentId, nationalId);
    if (!s.ok) {
      setError(
        persianError(s.errorMessage, "ارسال کد تایید ناموفق بود. دوباره تلاش کنید."),
      );
      setBusy(false);
      return;
    }

    setStep("otp");
    setNotice("کد تایید به شماره موبایل ثبت‌شده در بالون پیامک شد.");
    setCooldown(RESEND_SECONDS);
    setBusy(false);
  }

  async function handleResend() {
    if (!accessToken || busy || cooldown > 0) return;
    setBusy(true);
    setError("");
    setNotice("");
    const s = await baloanSendOtp(accessToken, paymentIntentId, nationalId);
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

    const r = await baloanSettle(accessToken, paymentIntentId, nationalId, otp);

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
      clearResume();
      router.replace(`/receipt/success?id=${paymentIntentId}`);
      return; // keep busy = true through navigation
    }

    if (status === "OtpInvalid") {
      setOtp("");
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

  function handleCancel() {
    clearResume();
    onCancel();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-card border border-line bg-surface p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-bold text-ink">پرداخت اعتباری بالون</h1>
        <p className="mb-5 text-sm text-muted">
          {step === "id"
            ? "برای پرداخت با اعتبار بالون، کد ملی خود را وارد کنید."
            : "کد تایید پیامک‌شده را وارد کنید."}
        </p>

        {credit ? (
          <div className="mb-4 rounded-btn bg-canvas px-4 py-3 text-sm text-ink">
            <div className="flex items-center justify-between">
              <span className="text-muted">مبلغ قابل پرداخت</span>
              <span className="font-bold tnum">
                {formatToman(credit.requiredToman)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-muted">اعتبار بالون شما</span>
              <span className="tnum">{formatToman(credit.userCreditToman)}</span>
            </div>
          </div>
        ) : null}

        {step === "id" ? (
          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-ink">کد ملی</span>
            <input
              value={toPersianDigits(nationalId)}
              onChange={(e) =>
                setNationalId(
                  toEnglishDigits(e.target.value).replace(/\D/g, "").slice(0, 10),
                )
              }
              inputMode="numeric"
              autoComplete="off"
              placeholder="۱۰ رقم"
              className="w-full rounded-btn border border-line bg-canvas px-4 py-3 text-sm outline-none transition focus:border-teal-400 tnum"
            />
          </label>
        ) : (
          <label className="mb-2 block">
            <span className="mb-1.5 block text-sm font-medium text-ink">کد تایید</span>
            <input
              value={toPersianDigits(otp)}
              onChange={(e) =>
                setOtp(
                  toEnglishDigits(e.target.value).replace(/\D/g, "").slice(0, 8),
                )
              }
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="کد پیامک‌شده"
              className="w-full rounded-btn border border-line bg-canvas px-4 py-3 text-center text-lg tracking-widest outline-none transition focus:border-teal-400 tnum"
            />
          </label>
        )}

        {error ? (
          <p className="mb-3 text-sm text-danger">{error}</p>
        ) : notice ? (
          <p className="mb-3 text-sm text-teal-700">{notice}</p>
        ) : null}

        {step === "id" ? (
          <button
            type="button"
            onClick={handleCheckAndSend}
            disabled={!idValid || busy}
            className="w-full rounded-btn bg-teal-600 px-6 py-3 text-sm font-bold text-surface transition hover:bg-teal-700 disabled:opacity-50"
          >
            {busy ? "در حال بررسی…" : "بررسی اعتبار و دریافت کد تایید"}
          </button>
        ) : (
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
        )}

        <button
          type="button"
          onClick={handleCancel}
          disabled={busy}
          className="mt-4 block w-full text-center text-xs text-muted transition hover:text-ink disabled:opacity-50"
        >
          انصراف و بازگشت
        </button>
      </div>
    </div>
  );
}
