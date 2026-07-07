/**
 * Generic, brand-tinted icon for a payment gateway (the backend doesn't send
 * icons). Not a brand logo — a neutral wallet glyph on a per-gateway color,
 * chosen by the gateway `key`. Unknown keys get a neutral teal.
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
  className = "",
}: {
  gatewayKey: string;
  className?: string;
}) {
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
