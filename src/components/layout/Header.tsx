import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { HeaderBack } from "@/components/layout/HeaderBack";
import { CategoryMenu } from "@/components/layout/CategoryMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import { HeaderCartButton } from "@/components/layout/HeaderCartButton";
import { SearchIcon } from "@/components/ui/icons";
import type { CategoryTreeNode } from "@/lib/shop/category";

function GearIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
    >
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6M18.1 18.1l-1.6-1.6M7.5 7.5 5.9 5.9" />
    </svg>
  );
}

export function Header({ categories }: { categories: CategoryTreeNode[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-[88px] md:px-8">
        {/* Right (RTL start): back button + category dropdown + store link */}
        <div className="flex items-center gap-1 md:gap-8">
          <span className="md:hidden">
            <HeaderBack />
          </span>
          <span className="hidden md:block">
            <CategoryMenu categories={categories} />
          </span>
          <Link
            href="/#store"
            className="hidden text-sm font-semibold text-ink md:block"
          >
            فروشگاه
          </Link>
        </div>

        {/* Center: logo */}
        <Logo className="md:absolute md:left-1/2 md:-translate-x-1/2" />

        {/* Left (RTL end): icon cluster */}
        <div dir="ltr" className="flex items-center gap-2 md:gap-4.5">
          <HeaderCartButton />
          <span className="md:hidden">
            <Link
              href="/search"
              aria-label="جستجو"
              className="grid h-10 w-10 place-items-center rounded-full text-ink/80 transition hover:bg-canvas"
            >
              <SearchIcon className="h-[22px] w-[22px]" />
            </Link>
          </span>
          <span className="hidden md:block">
            <UserMenu />
          </span>
          <Link
            href="/profile"
            aria-label="تنظیمات"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-line bg-surface text-ink transition hover:bg-canvas"
          >
            <GearIcon className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
