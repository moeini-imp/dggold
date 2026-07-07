"use client";

import { useEffect } from "react";
import { CloseIcon, PlusIcon } from "@/components/ui/icons";
import { toPersianDigits } from "@/lib/format";
import type { Address } from "@/lib/shop/address";

/** "انتخاب آدرس" — pick a saved address or add a new one. */
export function AddressSelectModal({
  open,
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  onClose,
}: {
  open: boolean;
  addresses: Address[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-md rounded-t-hero bg-surface p-5 shadow-pop md:rounded-hero">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">انتخاب آدرس</h2>
          <button
            type="button"
            aria-label="بستن"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-ink/60 hover:bg-canvas"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-3 text-sm font-medium text-muted">آدرس‌های من</p>

        <ul className="max-h-[55vh] space-y-2 overflow-y-auto overscroll-contain">
          {addresses.map((a) => {
            const selected = a.id === selectedId;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(a.id);
                    onClose();
                  }}
                  className={`w-full rounded-card border p-4 text-right transition ${
                    selected
                      ? "border-teal-600 bg-teal-50"
                      : "border-line hover:border-teal-300"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold text-teal-700">
                      {a.title || `${a.provinceName}، ${a.cityName}`}
                    </span>
                    {selected ? (
                      <span className="text-xs font-medium text-teal-600">
                        انتخاب‌شده
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-ink">{a.address}</p>
                  <p className="mt-1 text-xs text-muted tnum">
                    کد پستی: {toPersianDigits(a.zipCode)}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={onAddNew}
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-btn border border-teal-600 py-3 font-bold text-teal-700 transition hover:bg-teal-50"
        >
          <PlusIcon className="h-5 w-5" />
          افزودن آدرس جدید
        </button>
      </div>
    </div>
  );
}
