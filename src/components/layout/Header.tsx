import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CartBadge } from "@/components/cart/CartBadge";
import { HeaderBack } from "@/components/layout/HeaderBack";
import {
  CartIcon,
  ChevronDown,
  HelpIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/icons";

const navLinks = [
  { href: "/categories", label: "دسته‌بندی محصولات", caret: true },
  { href: "/contact", label: "تماس با ما" },
];

function IconButton({
  children,
  label,
  href,
  badge,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center rounded-full text-ink/80 transition hover:bg-canvas hover:text-teal-700"
    >
      {children}
      {badge ? (
        <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink tnum">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Right (RTL start): back button + nav links */}
        <div className="flex items-center gap-1">
          <HeaderBack />
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1 text-sm font-medium text-ink/80 transition hover:text-teal-700"
              >
                {l.label}
                {l.caret ? <ChevronDown className="h-4 w-4" /> : null}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: logo */}
        <Logo className="md:absolute md:left-1/2 md:-translate-x-1/2" />

        {/* Left (RTL end): icon cluster */}
        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink/80 transition hover:bg-canvas hover:text-teal-700"
          >
            <CartIcon className="h-[22px] w-[22px]" />
            <CartBadge className="absolute -top-0.5 -right-0.5" />
          </Link>
          <IconButton href="/search" label="جستجو">
            <SearchIcon className="h-[22px] w-[22px]" />
          </IconButton>
          <span className="hidden md:block">
            <IconButton href="/profile" label="حساب کاربری">
              <UserIcon className="h-[22px] w-[22px]" />
            </IconButton>
          </span>
          <span className="hidden md:block">
            <IconButton href="/help" label="راهنما">
              <HelpIcon className="h-[22px] w-[22px]" />
            </IconButton>
          </span>
        </div>
      </div>
    </header>
  );
}
