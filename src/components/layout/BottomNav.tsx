"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CartIcon,
  GridIcon,
  HomeIcon,
  UserIcon,
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

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs transition ${
                  active ? "text-teal-700" : "text-muted"
                }`}
              >
                <span className="relative">
                  <Icon className="h-6 w-6" />
                  {href === "/cart" ? (
                    <CartBadge className="absolute -top-1 -right-2" />
                  ) : null}
                </span>
                <span className={active ? "font-bold" : ""}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
