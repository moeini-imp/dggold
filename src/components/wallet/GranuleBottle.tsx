"use client";

import { useId } from "react";

/**
 * Rectangular glass bottle with a cork stopper (matches the real granule
 * bottles). `fraction` (0..1) sets the gold fill height; it animates on change.
 */
export function GranuleBottle({
  fraction,
  className = "",
}: {
  fraction: number;
  className?: string;
}) {
  const id = useId().replace(/[:]/g, "");
  const f = Math.max(0, Math.min(1, fraction));

  const top = 31;
  const bottom = 93;
  const fillY = bottom - (bottom - top) * f;

  const body =
    "M15 34 Q15 30 19 30 H45 Q49 30 49 34 V90 Q49 94 45 94 H19 Q15 94 15 90 Z";

  return (
    <svg viewBox="0 0 64 100" className={className} fill="none">
      <defs>
        <clipPath id={`c-${id}`}>
          <path d={body} />
        </clipPath>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0d488" />
          <stop offset="0.55" stopColor="#d8b052" />
          <stop offset="1" stopColor="#c9a24b" />
        </linearGradient>
      </defs>

      {/* glass tint */}
      <path d={body} className="fill-current opacity-10" />
      <path d="M27 24 H37 V30.5 H27 Z" className="fill-current opacity-10" />

      {/* granule fill */}
      <g clipPath={`url(#c-${id})`}>
        <rect
          x="0"
          width="64"
          y={fillY}
          height="100"
          fill={`url(#g-${id})`}
          style={{ transition: "y 0.7s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <rect
          x="0"
          width="64"
          y={fillY}
          height={f > 0 ? 2 : 0}
          fill="#ffffff"
          opacity="0.35"
          style={{ transition: "y 0.7s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </g>

      {/* neck + body outline */}
      <path
        d="M27 24.5 V30.5 M37 24.5 V30.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={body}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* cork */}
      <path
        d="M25.5 10 Q25.5 7.5 28 7.5 H36 Q38.5 7.5 38.5 10 V21 Q38.5 24 36 24 H28 Q25.5 24 25.5 21 Z"
        fill="#cbaa78"
        stroke="#a98450"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M25.7 12.5 H38.3" stroke="#a98450" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
