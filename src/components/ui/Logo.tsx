import Link from "next/link";

/** DG Gold wordmark — teal-gradient DG monogram + "دیجی گلد" wordmark. */
export function Logo({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <Link
      href="/"
      aria-label="دیجی گلد"
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-500 text-base font-extrabold text-gold-300">
        DG
      </span>
      <span className="flex flex-col leading-[1.15]">
        <span
          className={`text-[19px] font-extrabold ${dark ? "text-surface" : "text-ink"}`}
        >
          دیجی گلد
        </span>
        <span
          className={`text-[10px] font-semibold tracking-wider ${dark ? "text-gold-300" : "text-gold-600"}`}
        >
          DG GOLD
        </span>
      </span>
    </Link>
  );
}
