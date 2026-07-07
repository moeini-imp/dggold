"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "@/components/ui/icons";
import { toEnglishDigits } from "@/lib/format";
import type { Place } from "@/lib/shop/place";

/**
 * Searchable single-select. Click to open, type to filter. Shows ~5 rows;
 * the list scrolls internally for more and its scroll is contained (won't
 * scroll the page). Click-outside / Escape closes and reverts the query.
 */
export function SearchSelect({
  label,
  placeholder = "انتخاب کنید",
  items,
  value,
  onSelect,
  disabled = false,
  loading = false,
  error = "",
  emptyText = "موردی یافت نشد",
}: {
  label: string;
  placeholder?: string;
  items: Place[];
  value: number | null;
  onSelect: (item: Place) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedName = items.find((i) => i.id === value)?.name ?? "";

  const filtered = useMemo(() => {
    const q = toEnglishDigits(query.trim()).toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openBox() {
    if (disabled) return;
    setQuery("");
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <label className="mb-4 block" ref={wrapRef}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>

      <div className="relative">
        <div
          className={`flex items-center gap-2 rounded-btn border bg-canvas px-4 py-3 transition ${
            disabled
              ? "cursor-not-allowed opacity-60"
              : "cursor-text focus-within:border-teal-400"
          } ${open ? "border-teal-400" : "border-line"}`}
          onClick={openBox}
        >
          <input
            ref={inputRef}
            value={open ? query : selectedName}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={openBox}
            disabled={disabled}
            placeholder={selectedName && !open ? selectedName : placeholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed"
          />
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
          />
        </div>

        {open ? (
          <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-card border border-line bg-surface shadow-pop">
            <ul className="max-h-52 overflow-y-auto overscroll-contain py-1">
              {loading ? (
                <li className="px-4 py-3 text-center text-sm text-muted">
                  در حال بارگذاری…
                </li>
              ) : filtered.length === 0 ? (
                <li className="px-4 py-3 text-center text-sm text-muted">
                  {emptyText}
                </li>
              ) : (
                filtered.map((item) => {
                  const selected = item.id === value;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(item);
                          setOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-right text-sm transition hover:bg-canvas ${
                          selected ? "font-bold text-teal-700" : "text-ink"
                        }`}
                      >
                        {item.name}
                        {selected ? <span className="text-teal-600">✓</span> : null}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ) : null}
      </div>

      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}
