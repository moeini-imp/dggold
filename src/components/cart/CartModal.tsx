"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { useResolvedCartLines } from "@/components/cart/useResolvedCartLines";
import { ProductImage } from "@/components/ui/ProductImage";
import { CartIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { formatToman, toPersianDigits } from "@/lib/format";
import type { CartDisplayLine } from "@/lib/types";

function ModalLine({
  line,
  onSetQty,
  onRemove,
}: {
  line: CartDisplayLine;
  onSetQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const href = line.slug
    ? `/Product/Detail/${line.productId}/${encodeURIComponent(line.slug)}`
    : "#";
  return (
    <div className="flex items-center gap-3.5 border-b border-line/70 py-3.5 last:border-b-0">
      <Link href={href} className="shrink-0">
        <ProductImage
          src={line.imageUrl}
          alt={line.title}
          className="h-12.5 w-12.5 rounded-xl bg-canvas"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Link
          href={href}
          className="line-clamp-2 text-sm font-bold leading-tight text-ink"
        >
          {line.title}
        </Link>
        <span className="text-[13px] font-bold text-teal-700 tnum">
          {formatToman(line.lineTotal)}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="کاهش تعداد"
          onClick={() => onSetQty(line.quantity - 1)}
          className="grid h-6.5 w-6.5 place-items-center rounded-lg border border-line text-ink transition hover:bg-canvas"
        >
          <MinusIcon className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-5 text-center text-sm font-bold tnum text-ink">
          {toPersianDigits(line.quantity)}
        </span>
        <button
          type="button"
          aria-label="افزایش تعداد"
          disabled={line.quantity >= line.maxQuantity}
          onClick={() =>
            onSetQty(Math.min(line.quantity + 1, line.maxQuantity))
          }
          className="grid h-6.5 w-6.5 place-items-center rounded-lg border border-line text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PlusIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        type="button"
        aria-label="حذف"
        onClick={onRemove}
        className="grid h-7.5 w-7.5 shrink-0 place-items-center rounded-lg bg-red-50 text-danger transition hover:bg-red-100"
      >
        <TrashIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function CartModal() {
  const { modalOpen, closeModal, setQty, remove } = useCart();
  const details = useResolvedCartLines();
  const count = details.reduce((s, l) => s + l.quantity, 0);
  const total = details.reduce((s, l) => s + l.lineTotal, 0);

  // Escape to close.
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="بستن"
        onClick={closeModal}
        className="absolute inset-0 bg-teal-950/55 backdrop-blur-[3px]"
      />
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[22px] bg-surface shadow-pop md:max-h-[calc(100vh-5rem)] md:rounded-[22px]">
        {/* header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8.5 w-8.5 place-items-center rounded-[10px] bg-teal-600 text-gold-300">
              <CartIcon className="h-4 w-4" />
            </span>
            <span className="text-lg font-extrabold text-ink">سبد خرید</span>
            <span className="text-sm text-muted">
              ({toPersianDigits(count)} قلم)
            </span>
          </div>
          <button
            type="button"
            aria-label="بستن"
            onClick={closeModal}
            className="grid h-8 w-8 place-items-center rounded-lg bg-canvas text-ink"
          >
            <CloseIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* lines */}
        {details.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-14 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-canvas text-muted">
              <CartIcon className="h-7 w-7" />
            </span>
            <p className="font-bold text-ink">سبد خرید شما خالی است</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6">
            {details.map((line) => (
              <ModalLine
                key={`${line.productId}-${line.vendorId}`}
                line={line}
                onSetQty={(q) => setQty(line.productId, line.vendorId, q)}
                onRemove={() => remove(line.productId, line.vendorId)}
              />
            ))}
          </div>
        )}

        {/* footer */}
        {details.length > 0 ? (
          <div className="border-t border-line bg-[#FBFAF7] px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted">مبلغ قابل پرداخت</span>
              <span className="text-lg font-extrabold text-ink tnum">
                {formatToman(total)}
              </span>
            </div>
            <div className="flex gap-3">
              <Link
                href="/checkout"
                onClick={closeModal}
                className="flex flex-1 items-center justify-center rounded-[13px] bg-teal-600 py-3.5 text-sm font-bold text-gold-300 transition hover:bg-teal-700"
              >
                پرداخت
              </Link>
              <button
                type="button"
                onClick={closeModal}
                className="flex flex-1 items-center justify-center rounded-[13px] border border-teal-600 bg-surface py-3.5 text-sm font-bold text-teal-600 transition hover:bg-teal-50"
              >
                ادامه خرید
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
