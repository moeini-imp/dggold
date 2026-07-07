/**
 * Placeholder product image until real assets/CDN are wired up.
 * Renders a tasteful gold/silver gradient with a simple silhouette so the
 * cards look intentional rather than broken. When `imageUrl` is a real URL
 * (not "placeholder:*"), it renders that instead.
 *
 * Real URLs use a plain <img> (not next/image) since marketplace images come
 * from arbitrary external CDNs we can't all whitelist in remotePatterns.
 */

const tones: Record<string, { from: string; to: string; chip: string }> = {
  gold: { from: "#f3d98a", to: "#caa24b", chip: "#a8842f" },
  coin: { from: "#f6e2a0", to: "#d8b052", chip: "#b08a2e" },
  bar: { from: "#f0d27e", to: "#c79a3f", chip: "#9c7a2c" },
  silver: { from: "#e9ecf0", to: "#bcc3cc", chip: "#8a9096" },
};

export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (!src.startsWith("placeholder:")) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  const toneKey = src.split(":")[1] ?? "gold";
  const t = tones[toneKey] ?? tones.gold;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
    >
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`g-${toneKey}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={t.from} />
            <stop offset="100%" stopColor={t.to} />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="#faf8f3" />
        {toneKey === "coin" ? (
          <>
            <circle cx="100" cy="100" r="58" fill={`url(#g-${toneKey})`} />
            <circle
              cx="100"
              cy="100"
              r="58"
              fill="none"
              stroke={t.chip}
              strokeWidth="3"
              opacity="0.5"
            />
            <circle
              cx="100"
              cy="100"
              r="42"
              fill="none"
              stroke={t.chip}
              strokeWidth="2"
              opacity="0.4"
            />
          </>
        ) : (
          <g transform="rotate(-12 100 100)">
            <rect
              x="48"
              y="74"
              width="104"
              height="52"
              rx="10"
              fill={`url(#g-${toneKey})`}
            />
            <rect
              x="48"
              y="74"
              width="104"
              height="52"
              rx="10"
              fill="none"
              stroke={t.chip}
              strokeWidth="2"
              opacity="0.45"
            />
            <rect
              x="60"
              y="86"
              width="80"
              height="6"
              rx="3"
              fill="#fff"
              opacity="0.35"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
