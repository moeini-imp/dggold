"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { GatewayRedirect } from "@/components/checkout/GatewayRedirect";
import { PaymentGatewayIcon } from "@/components/checkout/PaymentGatewayIcon";
import { GranuleBottle } from "@/components/wallet/GranuleBottle";
import {
  formatToman,
  groupThousands,
  persianError,
  toEnglishDigits,
  toPersianDigits,
} from "@/lib/format";
import {
  MIN_GRANULE_SOOT,
  bottleFraction,
  formatGranule,
  granuleFeeRate,
} from "@/lib/wallet/granule";
import { buyGranule, sellGranule } from "@/lib/wallet/buy";
import { getUserInfo } from "@/lib/shop/user";
import type { AddOrderData } from "@/lib/shop/order";
import type { PaymentGateway } from "@/lib/shop/payment";

const PRESET_GRAMS = [0.5, 1, 2, 5];
/** Gateway key of the Baloan credit gateway — needs the buyer's national code. */
const BALOAN_KEY = "Baloan";

export function GranuleTradeModal({
  mode,
  token,
  price,
  currentGrams,
  gateways,
  onClose,
  onSuccess,
}: {
  mode: "buy" | "sell";
  token: string;
  price: number; // 18k per-gram live price (Toman)
  currentGrams: number;
  gateways: PaymentGateway[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isBuy = mode === "buy";
  // Both amount fields are editable and kept in sync (سوت ↔ تومان).
  const [soot, setSoot] = useState(MIN_GRANULE_SOOT);
  const [toman, setToman] = useState(() =>
    price > 0 ? Math.round((MIN_GRANULE_SOOT / 1000) * price) : 0,
  );
  const [gatewayKey, setGatewayKey] = useState(gateways[0]?.key ?? "");
  const [nationalCode, setNationalCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState<AddOrderData | null>(null);
  const [sold, setSold] = useState<number | null>(null);

  const isBaloan = isBuy && gatewayKey === BALOAN_KEY;
  const nationalCodeValid = /^\d{10}$/.test(nationalCode);

  // Best-effort prefill of the national code from the profile (only for Baloan).
  useEffect(() => {
    if (!isBaloan || !token) return;
    let active = true;
    getUserInfo(token).then((info) => {
      if (!active || !info.nationalCode) return;
      const digits = info.nationalCode.replace(/\D/g, "").slice(0, 10);
      setNationalCode((prev) => prev || digits);
    });
    return () => {
      active = false;
    };
  }, [isBaloan, token]);

  const setFromToman = (tv: number) => {
    setToman(tv);
    setSoot(price > 0 ? Math.round((tv / price) * 1000) : 0);
  };
  const setFromSoot = (sv: number) => {
    setSoot(sv);
    setToman(Math.round((sv / 1000) * price));
  };

  const feeRate = granuleFeeRate(gateways.find((g) => g.key === gatewayKey)?.name);
  const fee = isBuy ? Math.round(toman * feeRate) : 0;
  const total = toman + fee; // buy: pay this / sell: receive `toman`
  const newGrams = isBuy
    ? currentGrams + soot / 1000
    : Math.max(0, currentGrams - soot / 1000);

  const overBalance = !isBuy && soot > Math.round(currentGrams * 1000);
  const valid =
    soot >= MIN_GRANULE_SOOT &&
    price > 0 &&
    !overBalance &&
    (!isBaloan || nationalCodeValid);

  async function confirm() {
    if (soot < MIN_GRANULE_SOOT) {
      setError(`حداقل ${toPersianDigits(MIN_GRANULE_SOOT)} سوت (نیم گرم) است.`);
      return;
    }
    if (overBalance) {
      setError("مقدار فروش از موجودی شما بیشتر است.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (isBuy) {
        const gatewayId = gateways.find((g) => g.key === gatewayKey)?.id;
        if (!gatewayId) {
          setError("درگاه پرداخت را انتخاب کنید.");
          setSubmitting(false);
          return;
        }
        const res = await buyGranule(token, "gold", {
          assetCode: "IRR",
          gatewayId,
          productCategory: 1,
          productSymbol: 2,
          productGrossAmountInMg: soot,
          clientUnitPrice: price,
          ...(isBaloan ? { nationalCode } : {}),
        });
        if (!res.ok) {
          setError(persianError(res.errorMessage, "ثبت خرید ناموفق بود."));
          setSubmitting(false);
          return;
        }
        if (res.intent?.redirectUrl) {
          setRedirect(res.intent as unknown as AddOrderData);
          return;
        }
        onSuccess();
      } else {
        const res = await sellGranule(token, "gold", {
          productGrossAmountInMg: soot,
          clientUnitPrice: price,
        });
        if (!res.ok) {
          setError(persianError(res.errorMessage, "ثبت فروش ناموفق بود."));
          setSubmitting(false);
          return;
        }
        setSold(res.totalAmountInToman ?? total);
      }
    } catch {
      setError("خطا رخ داد. دوباره تلاش کنید.");
      setSubmitting(false);
    }
  }

  if (redirect) return <GatewayRedirect data={redirect} />;

  const setPreset = (grams: number) => setFromSoot(Math.round(grams * 1000));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[24px] bg-surface p-6 shadow-pop sm:rounded-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-extrabold text-ink">
            {isBuy ? "خرید گرانول طلا" : "فروش گرانول طلا"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-canvas"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {sold !== null ? (
          // sell success
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-2xl text-teal-700">
              ✓
            </span>
            <p className="font-extrabold text-ink">فروش با موفقیت انجام شد</p>
            <p className="text-sm text-muted">
              <span className="font-bold text-teal-700 tnum">
                {formatToman(sold)}
              </span>{" "}
              به کیف پول ریالی شما اضافه شد.
            </p>
            <button
              type="button"
              onClick={onSuccess}
              className="mt-2 w-full rounded-btn bg-teal-600 py-3 font-bold text-surface hover:bg-teal-700"
            >
              باشه
            </button>
          </div>
        ) : (
          <>
            {/* bottle preview */}
            <div className="flex flex-col items-center">
              <GranuleBottle
                fraction={bottleFraction(newGrams)}
                className="h-28 w-20 text-gold-600"
              />
              <p className="mt-1 text-xs text-muted">
                موجودی پس از {isBuy ? "خرید" : "فروش"}:{" "}
                <span className="font-bold text-ink tnum">
                  {formatGranule(Math.round(newGrams * 1000))}
                </span>
              </p>
            </div>

            {/* toman presets (by weight) */}
            <p className="mb-2 mt-5 text-sm font-medium text-ink">مقدار</p>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_GRAMS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setPreset(g)}
                  className={`rounded-btn border py-2 text-xs font-bold transition ${
                    soot === Math.round(g * 1000)
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-line text-ink hover:border-teal-300"
                  }`}
                >
                  {formatGranule(Math.round(g * 1000))}
                </button>
              ))}
            </div>

            {/* both inputs — edit either, the other converts in real time */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-btn border border-line bg-canvas px-4 py-2.5">
                <input
                  value={toman ? toPersianDigits(groupThousands(toman)) : ""}
                  onChange={(e) =>
                    setFromToman(
                      Number(toEnglishDigits(e.target.value).replace(/\D/g, "")) || 0,
                    )
                  }
                  inputMode="numeric"
                  placeholder="مبلغ به تومان"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none tnum"
                />
                <span className="shrink-0 text-xs text-muted">تومان</span>
              </div>
              <div className="flex items-center gap-2 rounded-btn border border-line bg-canvas px-4 py-2.5">
                <input
                  value={soot ? toPersianDigits(soot) : ""}
                  onChange={(e) =>
                    setFromSoot(
                      Number(toEnglishDigits(e.target.value).replace(/\D/g, "")) || 0,
                    )
                  }
                  inputMode="numeric"
                  placeholder="مقدار به سوت"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none tnum"
                />
                <span className="shrink-0 text-xs text-muted">سوت</span>
              </div>
            </div>
            {soot >= 1000 ? (
              <p className="mt-1.5 text-xs text-muted">
                معادل{" "}
                <span className="font-bold text-ink tnum">
                  {formatGranule(soot)}
                </span>{" "}
                گرانول طلا
              </p>
            ) : null}
            {soot > 0 && soot < MIN_GRANULE_SOOT ? (
              <p className="mt-1 text-xs text-danger">
                حداقل {toPersianDigits(MIN_GRANULE_SOOT)} سوت (نیم گرم)
              </p>
            ) : null}
            {overBalance ? (
              <p className="mt-1 text-xs text-danger">
                بیشتر از موجودی شما ({formatGranule(Math.round(currentGrams * 1000))})
              </p>
            ) : null}

            {/* gateway (buy only) */}
            {isBuy && gateways.length ? (
              <>
                <p className="mb-2 mt-5 text-sm font-medium text-ink">
                  درگاه پرداخت
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {gateways.map((g) => {
                    const on = g.key === gatewayKey;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGatewayKey(g.key)}
                        className={`flex min-w-0 items-center gap-2.5 rounded-card border p-2.5 text-right transition ${
                          on
                            ? "border-teal-600 bg-teal-50"
                            : "border-line hover:border-teal-300"
                        }`}
                      >
                        <PaymentGatewayIcon
                          gatewayKey={g.key}
                          imageUrl={g.imageUrl}
                          name={g.name}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                          {g.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Baloan requires the buyer's national code */}
                {isBaloan ? (
                  <div className="mt-3">
                    <label className="mb-1.5 block text-sm font-medium text-ink">
                      کد ملی
                    </label>
                    <input
                      value={toPersianDigits(nationalCode)}
                      onChange={(e) =>
                        setNationalCode(
                          toEnglishDigits(e.target.value)
                            .replace(/\D/g, "")
                            .slice(0, 10),
                        )
                      }
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="۱۰ رقم"
                      className="w-full rounded-btn border border-line bg-canvas px-4 py-3 text-sm outline-none transition focus:border-teal-400 tnum"
                    />
                    <span className="mt-1 block text-xs text-muted">
                      برای پرداخت اعتباری بالون، کد ملی الزامی است.
                    </span>
                  </div>
                ) : null}
              </>
            ) : null}

            {/* breakdown */}
            <div className="mt-5 space-y-2 rounded-card bg-canvas p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">قیمت لحظه‌ای (۱۸ عیار)</span>
                <span className="font-medium text-ink tnum">
                  {formatToman(price)} / گرم
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">
                  {isBuy ? "ارزش گرانول" : "مبلغ دریافتی (تقریبی)"}
                </span>
                <span className="font-medium text-ink tnum">
                  {formatToman(toman)}
                </span>
              </div>
              {isBuy ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted">
                    کارمزد خرید ({toPersianDigits(feeRate * 100)}٪)
                  </span>
                  <span className="font-medium text-ink tnum">
                    {formatToman(fee)}
                  </span>
                </div>
              ) : null}
              <div className="mt-1 flex items-center justify-between border-t border-line pt-2">
                <span className="font-bold text-ink">
                  {isBuy ? "مبلغ قابل پرداخت" : "مبلغ دریافتی"}
                </span>
                <span className="text-lg font-extrabold text-teal-700 tnum">
                  {formatToman(isBuy ? total : toman)}
                </span>
              </div>
            </div>

            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

            <button
              type="button"
              onClick={confirm}
              disabled={submitting || !valid}
              className="mt-5 w-full rounded-btn bg-teal-600 py-3 text-center font-bold text-surface transition hover:bg-teal-700 disabled:opacity-60"
            >
              {submitting
                ? "در حال ثبت…"
                : isBuy
                  ? `پرداخت ${formatToman(total)}`
                  : `فروش و دریافت ${formatToman(toman)}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
