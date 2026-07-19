import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { HeaderBack } from "@/components/layout/HeaderBack";
import { CategoryMenu } from "@/components/layout/CategoryMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import { HeaderCartButton } from "@/components/layout/HeaderCartButton";
import { SearchIcon } from "@/components/ui/icons";
import type { CategoryTreeNode } from "@/lib/shop/category";

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
        </div>
      </div>
    </header>
  );
}
