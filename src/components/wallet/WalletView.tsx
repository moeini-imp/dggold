"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { WalletIcon, CloseIcon, TruckIcon } from "@/components/ui/icons";
import { formatToman, formatJalali, toPersianDigits } from "@/lib/format";
import type { AssetPrice } from "@/lib/shop/assetPrice";
import type { PaymentGateway } from "@/lib/shop/payment";
import { GranuleBottle } from "@/components/wallet/GranuleBottle";
import { GranuleTradeModal } from "@/components/wallet/GranuleTradeModal";
import { bottleFraction } from "@/lib/wallet/granule";
import {
  assetAmount,
  buildMockWalletOverview,
  getWalletOverview,
  type WalletOverview,
} from "@/lib/wallet/wallet";
import {
  buildMockTransactions,
  getWalletTransactions,
  type WalletTransaction,
} from "@/lib/wallet/transactions";

type AssetConf = {
  code: string;
  name: string;
  unit: "gram" | "toman";
  actions: [string, string]; // [primary, secondary]
};

// Gold first = the default/main asset on the card. (Silver hidden for now.)
const ASSETS: AssetConf[] = [
  { code: "XAU", name: "طلا", unit: "gram", actions: ["خرید", "فروش"] },
  { code: "IRR", name: "ریال", unit: "toman", actions: ["واریز", "برداشت"] },
];

function formatBalance(amount: number, unit: "gram" | "toman"): string {
  if (unit === "gram") return `${toPersianDigits(amount)} میلی‌گرم`;
  // The rial (IRR) balance comes from the backend in Rial; show it in Toman.
  return formatToman(Math.round(amount / 10));
}

const isIncoming = (t: WalletTransaction) => t.transactionType === "واریز";

function txAmount(t: WalletTransaction): string {
  return `${isIncoming(t) ? "+" : "−"} ${formatToman(t.amountInToman)}`;
}

function txTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "";
  const p = (n: number) => toPersianDigits(String(n).padStart(2, "0"));
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function WalletView({
  prices,
  gateways,
}: {
  prices: AssetPrice[];
  gateways: PaymentGateway[];
}) {
  const router = useRouter();
  const { isAuthenticated, hydrated, accessToken } = useAuth();
  const [overview, setOverview] = useState<WalletOverview | null>(null);
  const [txs, setTxs] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [selected, setSelected] = useState("XAU");
  const [openTx, setOpenTx] = useState<WalletTransaction | null>(null);
  const [tradeMode, setTradeMode] = useState<"buy" | "sell" | null>(null);
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);

  const price18 = prices.find((p) => p.symbol === 2)?.price ?? 0;

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login?redirect=/wallet");
    }
  }, [hydrated, isAuthenticated, router]);

  // wallet overview
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    queueMicrotask(() => setLoading(true));
    getWalletOverview(accessToken)
      .then((o) => active && setOverview(o ?? buildMockWalletOverview()))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [accessToken, refresh]);

  // ledger transactions for the selected asset
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    queueMicrotask(() => setTxLoading(true));
    getWalletTransactions(accessToken, selected)
      .then((p) => active && setTxs((p ?? buildMockTransactions()).items))
      .finally(() => active && setTxLoading(false));
    return () => {
      active = false;
    };
  }, [accessToken, selected, refresh]);

  const data = overview ?? buildMockWalletOverview();
  const active = ASSETS.find((a) => a.code === selected) ?? ASSETS[0];
  const activeBalance = assetAmount(data, active.code);

  const onPrimary = () => {
    if (active.code === "XAU") setTradeMode("buy");
    else setNotice(`${active.actions[0]} ${active.name} به‌زودی فعال می‌شود.`);
  };
  const onSecondary = () => {
    if (active.code === "XAU") setTradeMode("sell");
    else setNotice(`${active.actions[1]} ${active.name} به‌زودی فعال می‌شود.`);
  };

  const sorted = useMemo(
    () => [...txs].sort((a, b) => +new Date(b.dateTime) - +new Date(a.dateTime)),
    [txs],
  );

  if (!hydrated || !isAuthenticated) {
    return <div className="py-24 text-center text-muted">در حال بارگذاری…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <h1 className="mb-5 text-xl font-extrabold text-ink md:text-2xl">
        کیف پول
      </h1>

      {/* balance card — main asset + switch */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-teal-700 to-teal-900 p-6 text-surface shadow-card md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/5"
        />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm text-teal-100">موجودی {active.name}</p>
            <p className="mt-2 text-3xl font-extrabold tnum">
              {loading ? "—" : formatBalance(activeBalance, active.unit)}
            </p>
          </div>
          {active.code === "IRR" ? (
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-gold-300">
              <WalletIcon className="h-7 w-7" />
            </span>
          ) : (
            <GranuleBottle
              fraction={bottleFraction(activeBalance)}
              className="h-16 w-11 text-white/90"
            />
          )}
        </div>

        {/* actions (terminology depends on the asset) */}
        <div className="relative mt-6 flex gap-3">
          <button
            type="button"
            onClick={onPrimary}
            className="flex-1 rounded-btn bg-gold-400 py-2.5 text-sm font-bold text-teal-900 transition hover:bg-gold-300"
          >
            {active.actions[0]}
          </button>
          <button
            type="button"
            onClick={onSecondary}
            className="flex-1 rounded-btn border border-white/40 py-2.5 text-sm font-bold text-surface transition hover:bg-white/10"
          >
            {active.actions[1]}
          </button>
        </div>

        {/* physical delivery (granule assets only) — UI only for now */}
        {active.code !== "IRR" ? (
          <button
            type="button"
            onClick={() => setNotice("تحویل فیزیکی به‌زودی فعال می‌شود.")}
            className="relative mt-3 flex w-full items-center justify-center gap-2 rounded-btn bg-white/10 py-2.5 text-sm font-bold text-surface transition hover:bg-white/15"
          >
            <TruckIcon className="h-5 w-5" />
            تحویل فیزیکی
          </button>
        ) : null}

        {/* asset switch */}
        <div className="relative mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-black/15 p-1.5">
          {ASSETS.map((a) => {
            const on = a.code === selected;
            return (
              <button
                key={a.code}
                type="button"
                onClick={() => setSelected(a.code)}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 transition ${
                  on ? "bg-white/15" : "hover:bg-white/5"
                }`}
              >
                <span
                  className={`text-xs ${on ? "font-bold text-gold-300" : "text-teal-100"}`}
                >
                  {a.name}
                </span>
                <span className="text-[11px] tnum text-teal-100/80">
                  {loading ? "—" : formatBalance(assetAmount(data, a.code), a.unit)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {notice ? (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-card border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-ink">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="shrink-0 text-xs font-bold text-teal-700"
          >
            بستن
          </button>
        </div>
      ) : null}

      {/* transactions */}
      <div className="mb-4 mt-8 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-ink">تراکنش‌ها</h2>
      </div>

      {txLoading ? (
        <p className="py-10 text-center text-sm text-muted">در حال بارگذاری…</p>
      ) : sorted.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          برای {active.name} تراکنشی ثبت نشده است.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {sorted.map((tx, i) => {
            const incoming = isIncoming(tx);
            return (
              <li key={tx.trackingCode || i}>
                <button
                  type="button"
                  onClick={() => setOpenTx(tx)}
                  className="flex w-full items-center gap-3.5 rounded-card border border-line bg-surface p-3.5 text-right shadow-card transition hover:shadow-pop"
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-bold ${
                      incoming
                        ? "bg-teal-50 text-teal-700"
                        : "bg-canvas text-muted"
                    }`}
                  >
                    {incoming ? "↓" : "↑"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-ink">
                      {tx.transactionType}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {tx.memo || formatJalali(tx.dateTime)}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-sm font-bold tnum ${
                      incoming ? "text-teal-700" : "text-ink"
                    }`}
                  >
                    {txAmount(tx)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {openTx ? (
        <TxDetailModal tx={openTx} onClose={() => setOpenTx(null)} />
      ) : null}

      {tradeMode && accessToken ? (
        <GranuleTradeModal
          mode={tradeMode}
          token={accessToken}
          price={price18}
          gateways={gateways}
          currentGrams={assetAmount(data, "XAU")}
          onClose={() => setTradeMode(null)}
          onSuccess={() => {
            setTradeMode(null);
            setRefresh((x) => x + 1);
          }}
        />
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <span className="shrink-0 text-sm text-muted">{label}</span>
      <span className="min-w-0 break-all text-left text-sm font-medium leading-relaxed text-ink">
        {value}
      </span>
    </div>
  );
}

function TxDetailModal({
  tx,
  onClose,
}: {
  tx: WalletTransaction;
  onClose: () => void;
}) {
  const incoming = tx.transactionType === "واریز";
  const time = txTime(tx.dateTime);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-[24px] bg-surface p-6 shadow-pop sm:rounded-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-extrabold text-ink">جزئیات تراکنش</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-canvas"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 py-2 text-center">
          <span
            className={`grid h-14 w-14 place-items-center rounded-full text-2xl font-bold ${
              incoming ? "bg-teal-50 text-teal-700" : "bg-canvas text-muted"
            }`}
          >
            {incoming ? "↓" : "↑"}
          </span>
          <p className="text-lg font-extrabold text-ink">{tx.transactionType}</p>
          <p
            className={`text-xl font-extrabold tnum ${
              incoming ? "text-teal-700" : "text-ink"
            }`}
          >
            {txAmount(tx)}
          </p>
        </div>

        <div className="mt-4 divide-y divide-line border-t border-line">
          <Row
            label="تاریخ"
            value={`${formatJalali(tx.dateTime)}${time ? ` - ${time}` : ""}`}
          />
          {tx.memo ? <Row label="توضیحات" value={tx.memo} /> : null}
          {tx.trackingCode ? (
            <Row label="کد پیگیری" value={tx.trackingCode} />
          ) : null}
          {tx.mobile ? (
            <Row label="موبایل" value={toPersianDigits(tx.mobile)} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
