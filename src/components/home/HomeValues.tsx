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
  { label: "تحویل فیزیکی در لحظه", sub: "تحویل فوری با بیمه رسمی", Icon: BoltIcon },
  { label: "ضمانت ۱۰۰٪ اصالت و عیار", sub: "فاکتور رسمی اتحادیه طلا", Icon: ShieldCheckIcon },
  { label: "ارسال به تمام نقاط کشور", sub: "بسته‌بندی امن و بیمه‌شده", Icon: TruckIcon },
  { label: "خرید اقساطی طلا", sub: "بیش از ۱۰ شریک اعتباری", Icon: CardIcon },
];

export function HomeValues() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {VALUES.map(({ label, sub, Icon }) => (
          <div key={label} className="flex flex-col items-center gap-2.5 text-center p-4 rounded-2xl border border-line/80 bg-surface shadow-xs">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-900 text-gold-300 shadow-xs md:h-16 md:w-16">
              <Icon className="h-7 w-7 md:h-8 md:w-8" />
            </span>
            <div className="min-w-0">
              <span className="block text-xs font-extrabold text-ink md:text-sm">
                {label}
              </span>
              <span className="block text-[11px] text-muted mt-0.5">
                {sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
