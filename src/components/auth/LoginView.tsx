"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OtpInput } from "@/components/auth/OtpInput";
import { useAuth } from "@/components/auth/AuthProvider";
import { EditIcon, InfoIcon, PhoneIcon } from "@/components/ui/icons";
import { requestOtp, verifyOtp } from "@/lib/auth/api";
import { toEnglishDigits, toPersianDigits } from "@/lib/format";

const OTP_LENGTH = 5;
const RESEND_SECONDS = 90;

function maskPhone(phone: string) {
  // 09304401060 -> 0930***1060
  if (phone.length < 8) return phone;
  return `${phone.slice(0, 4)}***${phone.slice(7)}`;
}

export function LoginView() {
  const router = useRouter();
  const params = useSearchParams();
  const { setSession } = useAuth();
  const redirect = params.get("redirect") || "/";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  function startCountdown() {
    setResendIn(RESEND_SECONDS);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1 && timer.current) clearInterval(timer.current);
        return s - 1;
      });
    }, 1000);
  }

  async function sendOtp(target: string) {
    setError("");
    setLoading(true);
    try {
      const res = await requestOtp(target);
      if (res?.success && res.data?.otpRequired) {
        return true;
      }
      setError(res?.errorMessage || "ارسال کد تایید ناموفق بود. دوباره تلاش کنید.");
      return false;
    } catch {
      setError("خطا در ارتباط با سرور. اتصال اینترنت را بررسی کنید.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = toEnglishDigits(phone).replace(/\D/g, "");
    if (!/^09\d{9}$/.test(normalized)) {
      setError("شماره موبایل را به‌درستی وارد کنید (مثل ۰۹۱۲۳۴۵۶۷۸۹).");
      return;
    }
    const ok = await sendOtp(normalized);
    if (ok) {
      setPhone(normalized);
      setCode("");
      setStep("otp");
      startCountdown();
    }
  }

  function changePhone() {
    setStep("phone");
    setCode("");
    setError("");
  }

  async function resend() {
    if (resendIn > 0) return;
    const ok = await sendOtp(phone);
    if (ok) startCountdown();
  }

  async function submitOtp(codeArg?: string) {
    const c = codeArg ?? code;
    if (c.length < OTP_LENGTH || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp(phone, c);
      const token = res?.data?.accessToken;
      if (res?.success && token) {
        setSession({
          accessToken: token,
          refreshToken: res.data?.refreshToken ?? null,
        });
        router.push(redirect);
        return;
      }
      setError(res?.errorMessage || "کد وارد شده صحیح نیست. دوباره تلاش کنید.");
      setCode("");
    } catch {
      setError("خطا در ارتباط با سرور. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    submitOtp();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 md:py-16">
      <div className="rounded-card bg-surface p-6 shadow-card md:p-8">
        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit}>
            <h1 className="text-xl font-extrabold text-ink">ورود / ثبت‌نام</h1>
            <p className="mt-2 text-sm text-muted">
              جهت ورود و یا ثبت‌نام، شماره تلفن خود را وارد نمایید.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-card bg-teal-50 px-4 py-3 text-sm text-teal-700">
              <InfoIcon className="h-5 w-5 shrink-0" />
              <span>مالکیت سیم‌کارت حتما باید به نام خودتان باشد.</span>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-btn border border-gold-300 px-3 py-2.5 focus-within:border-gold-500">
              <PhoneIcon className="h-5 w-5 shrink-0 text-gold-500" />
              <input
                value={toPersianDigits(phone)}
                onChange={(e) =>
                  setPhone(
                    toEnglishDigits(e.target.value).replace(/\D/g, "").slice(0, 11),
                  )
                }
                inputMode="numeric"
                autoFocus
                placeholder="شماره تماس"
                className="w-full bg-transparent text-center text-base outline-none placeholder:text-muted tnum"
              />
            </div>

            {error ? (
              <p className="mt-3 text-sm text-danger">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 block w-full rounded-btn bg-teal-600 py-3 text-center font-bold text-surface transition hover:bg-teal-700 disabled:opacity-60"
            >
              {loading ? "در حال ارسال…" : "دریافت کد تایید"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <h1 className="text-xl font-extrabold text-ink">تایید شماره تماس</h1>
            <p className="mt-2 text-sm text-muted">
              کد ارسال‌شده به شماره{" "}
              <span dir="ltr" className="font-medium text-ink tnum">
                {toPersianDigits(maskPhone(phone))}
              </span>{" "}
              را وارد کنید.
            </p>

            <button
              type="button"
              onClick={changePhone}
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gold-600 hover:underline"
            >
              <EditIcon className="h-4 w-4" />
              تغییر شماره تلفن
            </button>

            <div className="mt-5">
              <OtpInput
                value={code}
                onChange={setCode}
                onComplete={(c) => submitOtp(c)}
                length={OTP_LENGTH}
              />
            </div>

            {error ? (
              <p className="mt-3 text-sm text-danger">{error}</p>
            ) : null}

            <div className="mt-4 text-center text-sm">
              {resendIn > 0 ? (
                <span className="text-muted">
                  ارسال مجدد کد تا {toPersianDigits(resendIn)} ثانیه دیگر
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resend}
                  disabled={loading}
                  className="font-bold text-teal-700 hover:underline disabled:opacity-60"
                >
                  ارسال مجدد کد
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={code.length < OTP_LENGTH || loading}
              className="mt-5 block w-full rounded-btn bg-teal-600 py-3 text-center font-bold text-surface transition hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? "در حال بررسی…" : "تایید و ورود"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
