"use client";

import { useRef } from "react";
import { toEnglishDigits, toPersianDigits } from "@/lib/format";

/**
 * Segmented OTP input. `length` cells, digits only, auto-advance + backspace +
 * paste. Renders LTR so digits read naturally while the page stays RTL.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 5,
  autoFocus = true,
}: {
  value: string;
  onChange: (next: string) => void;
  /** Fired once all cells are filled (passes the full code). */
  onComplete?: (code: string) => void;
  length?: number;
  autoFocus?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("");

  const setAt = (i: number, d: string): string => {
    const arr = value.split("");
    arr[i] = d;
    const next = arr.join("").slice(0, length);
    onChange(next);
    return next;
  };

  const handleChange = (i: number, raw: string) => {
    const d = toEnglishDigits(raw).replace(/\D/g, "");
    if (!d) {
      setAt(i, "");
      return;
    }
    // take last typed char, advance
    const next = setAt(i, d[d.length - 1]);
    if (i < length - 1) refs.current[i + 1]?.focus();
    if (next.length === length) onComplete?.(next);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = toEnglishDigits(e.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, length);
    if (text) {
      onChange(text);
      refs.current[Math.min(text.length, length - 1)]?.focus();
      if (text.length === length) onComplete?.(text);
    }
  };

  return (
    <div
      dir="ltr"
      className="mx-auto flex max-w-xs items-stretch overflow-hidden rounded-btn border border-gold-300"
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digits[i] ? toPersianDigits(digits[i]) : ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          aria-label={`رقم ${i + 1}`}
          className="h-12 w-full min-w-0 flex-1 border-l border-line bg-surface text-center text-xl font-bold text-ink caret-teal-600 outline-none transition first:border-l-0 focus:bg-teal-50 tnum"
        />
      ))}
    </div>
  );
}
