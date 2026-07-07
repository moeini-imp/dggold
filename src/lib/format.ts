/**
 * Formatting helpers for the Persian/RTL UI.
 * Prices are stored as integer Toman in the data layer.
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert any ASCII digits in a string/number to Persian digits. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Convert Persian/Arabic-Indic digits in a string to ASCII (for API/input). */
export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** Group thousands with a comma. e.g. 1057200 -> "1,057,200" */
export function groupThousands(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Format a Toman amount the way the site shows it:
 * "۱,۰۵۷,۲۰۰ تومان"
 */
export function formatToman(value: number, withSuffix = true): string {
  const grouped = toPersianDigits(groupThousands(Math.round(value)));
  return withSuffix ? `${grouped} تومان` : grouped;
}

/** Compute a discount percentage from original/current prices. */
export function discountPercent(original: number, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * Lightweight Gregorian -> Jalali (Shamsi) conversion.
 * Returns { jy, jm, jd }. Algorithm: Borkowski.
 */
export function toJalali(gy: number, gm: number, gd: number) {
  const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gDaysInMonth.slice(0, gm - 1).reduce((a, b) => a + b, 0);

  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  void jDaysInMonth;
  return { jy, jm, jd };
}

/** Format an ISO date (or Date) as Jalali "۱۴۰۵/۰۵/۰۵". */
export function formatJalali(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const { jy, jm, jd } = toJalali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
  );
  const pad = (n: number) => String(n).padStart(2, "0");
  return toPersianDigits(`${jy}/${pad(jm)}/${pad(jd)}`);
}
