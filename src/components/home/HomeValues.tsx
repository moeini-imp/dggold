import { TruckIcon } from "@/components/ui/icons";

type IconProps = { className?: string };

function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l7 3v5c0 4-3 7.2-7 9-4-1.8-7-5-7-9V6l7-3Z"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth={1.7}
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth={1.7} />
      <path d="M6.5 14.5h4" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
    </svg>
  );
}

const VALUES = [
  { label: "تحویل فیزیکی در لحظه", Icon: BoltIcon },
  { label: "ضمانت اصالت کالا و فاکتور رسمی", Icon: ShieldCheckIcon },
  { label: "ارسال به تمام ایران", Icon: TruckIcon },
  { label: "خرید اعتباری", Icon: CardIcon },
];

/** Value props row — four circular icon badges (replaces the old delivery
 *  banner + about FAQ box). */
export function HomeValues() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4">
        {VALUES.map(({ label, Icon }) => (
          <div key={label} className="flex flex-col items-center gap-3 text-center">
            <span className="grid h-[68px] w-[68px] place-items-center rounded-full bg-gradient-to-br from-teal-600 to-teal-800 text-gold-300 shadow-card md:h-[76px] md:w-[76px]">
              <Icon className="h-7 w-7 md:h-8 md:w-8" />
            </span>
            <span className="max-w-[150px] text-[13px] font-bold leading-snug text-ink md:text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
