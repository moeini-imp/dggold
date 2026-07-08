/**
 * Payment gateway icon: renders the real logo when the backend provides one
 * (`imageUrl`); otherwise falls back to a generic, brand-tinted glyph keyed
 * by the gateway `key` (not an actual brand logo).
 */
const palette: Record<string, string> = {
  tara: "#e8542b",
  smartiz: "#0aa3c2",
  digipay: "#1a56db",
  saman: "#1f9d55",
  zarinpal: "#d4a017",
  payfa: "#d64550",
  parsian: "#c0392b",
  mellat: "#c0392b",
  sep: "#1f9d55",
};

export function PaymentGatewayIcon({
  gatewayKey,
  imageUrl,
  name,
  className = "",
}: {
  gatewayKey: string;
  imageUrl?: string;
  name?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name ?? gatewayKey}
          className="h-full w-full object-contain p-1"
        />
      </span>
    );
  }

  const color = palette[gatewayKey.toLowerCase()] ?? "#1c6b63";
  return (
    <span
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${className}`}
      style={{ backgroundColor: `${color}1a`, color }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M7 14.5h3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
