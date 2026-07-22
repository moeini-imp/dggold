"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CartIcon,
  GridIcon,
  HomeIcon,
  UserIcon,
  WalletIcon,
} from "@/components/ui/icons";
import { CartBadge } from "@/components/cart/CartBadge";

// RTL order: first item renders rightmost (matches wireframe: خانه on the right).
const tabs = [
  { href: "/", label: "خانه", Icon: HomeIcon, match: (p: string) => p === "/" },
  {
    href: "/categories",
    label: "دسته‌بندی",
    Icon: GridIcon,
    match: (p: string) => p.startsWith("/categories"),
  },
  {
    href: "/cart",
    label: "سبد خرید",
    Icon: CartIcon,
    match: (p: string) => p.startsWith("/cart"),
  },
  {
    href: "/profile",
    label: "پروفایل",
    Icon: UserIcon,
    match: (p: string) => p.startsWith("/profile"),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const walletActive = pathname.startsWith("/wallet");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5 items-end">
        {/* first two tabs (right side in RTL) */}
        {tabs.slice(0, 2).map(({ href, label, Icon, match }) => (
          <NavTab
            key={href}
            href={href}
            label={label}
            Icon={Icon}
            active={match(pathname)}
          />
        ))}

        {/* raised center wallet button */}
        <li className="relative flex justify-center">
          <Link
            href="/wallet"
            className="flex flex-col items-center gap-1 pb-2 pt-2.5 text-xs"
          >
            <span
              className={`-mt-8 grid h-14 w-14 place-items-center rounded-full text-surface shadow-pop ring-4 ring-surface transition ${
                walletActive ? "bg-teal-700" : "bg-teal-600"
              }`}
            >
              <WalletIcon className="h-7 w-7" />
            </span>
            <span
              className={walletActive ? "font-bold text-teal-700" : "text-muted"}
            >
              کیف پول
            </span>
          </Link>
        </li>

        {/* last two tabs (left side in RTL) */}
        {tabs.slice(2).map(({ href, label, Icon, match }) => (
          <NavTab
            key={href}
            href={href}
            label={label}
            Icon={Icon}
            active={match(pathname)}
            badge={href === "/cart"}
          />
        ))}
      </ul>
    </nav>
  );
}

function NavTab({
  href,
  label,
  Icon,
  active,
  badge,
}: {
  href: string;
  label: string;
  Icon: (p: { className?: string }) => React.ReactElement;
  active: boolean;
  badge?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex flex-col items-center gap-1 py-2.5 text-xs transition ${
          active ? "text-teal-700" : "text-muted"
        }`}
      >
        <span className="relative">
          <Icon className="h-6 w-6" />
          {badge ? <CartBadge className="absolute -top-1 -right-2" /> : null}
        </span>
        <span className={active ? "font-bold" : ""}>{label}</span>
      </Link>
    </li>
  );
}
