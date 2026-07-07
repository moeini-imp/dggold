import Link from "next/link";

/** DG Gold wordmark — teal "دیجی گلد" with a DG monogram + gold dot. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="دیجی گلد"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-teal-600 text-surface font-bold">
        DG
        <span className="absolute -top-0.5 -left-0.5 h-2 w-2 rounded-full bg-gold-400" />
      </span>
      <span className="text-lg font-extrabold leading-none text-teal-700">
        دیجی گلد
      </span>
    </Link>
  );
}
