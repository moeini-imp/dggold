"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { toPersianDigits } from "@/lib/format";

/**
 * Quantity stepper: − [n] +.
 * - When `onRemove` is given and value is 1, the minus becomes a trash icon
 *   that removes the line (danger color).
 * - When `atMax` is true, the plus is disabled and a "حداکثر" hint shows.
 */
export function QtyStepper({
  value,
  onDecrement,
  onIncrement,
  onRemove,
  atMax = false,
  size = "md",
  fullWidth = false,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove?: () => void;
  atMax?: boolean;
  size?: "sm" | "md";
  fullWidth?: boolean;
}) {
  const btn = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const box = size === "sm" ? "min-w-8 text-sm" : "min-w-10 text-base";

  const showTrash = value <= 1 && !!onRemove;

  return (
    <div
      className={`flex flex-col items-stretch gap-0.5 ${
        fullWidth ? "w-full" : "inline-flex"
      }`}
    >
      <div
        className={`items-center gap-1 rounded-btn border border-teal-200 bg-surface p-1 ${
          fullWidth ? "flex justify-between" : "inline-flex"
        }`}
      >
        <button
          type="button"
          aria-label={showTrash ? "حذف از سبد" : "کاهش تعداد"}
          onClick={showTrash ? onRemove : onDecrement}
          className={`grid ${btn} place-items-center rounded-lg transition ${
            showTrash
              ? "text-danger hover:bg-red-50"
              : "text-teal-700 hover:bg-teal-50"
          }`}
        >
          {showTrash ? (
            <TrashIcon className="h-5 w-5" />
          ) : (
            <MinusIcon className="h-5 w-5" />
          )}
        </button>

        <span className={`grid ${box} place-items-center font-bold tnum text-ink`}>
          {toPersianDigits(value)}
        </span>

        <button
          type="button"
          aria-label="افزایش تعداد"
          onClick={onIncrement}
          disabled={atMax}
          className={`grid ${btn} place-items-center rounded-lg transition ${
            atMax
              ? "cursor-not-allowed text-muted/50"
              : "text-teal-700 hover:bg-teal-50"
          }`}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {atMax ? (
        <span className="text-center text-[11px] text-muted">حداکثر</span>
      ) : null}
    </div>
  );
}
