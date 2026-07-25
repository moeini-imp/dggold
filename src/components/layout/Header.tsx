"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { HeaderBack } from "@/components/layout/HeaderBack";
import { CategoryMenu } from "@/components/layout/CategoryMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import { HeaderCartButton } from "@/components/layout/HeaderCartButton";
import { SearchIcon, WalletIcon } from "@/components/ui/icons";
import type { CategoryTreeNode } from "@/lib/shop/category";

export function Header({ categories }: { categories: CategoryTreeNode[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/category/${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        {/* Right (RTL start): Back + Category Menu + Nav Links */}
        <div className="flex items-center gap-2 md:gap-6">
          <span className="md:hidden">
            <HeaderBack />
          </span>

          <Logo className="md:hidden" />

          <div className="hidden items-center gap-5 md:flex">
            <Logo />
            <div className="h-5 w-px bg-line" />
            <CategoryMenu categories={categories} />
            <nav className="flex items-center gap-4 text-xs font-bold text-ink/80">
              <Link
                href="/baloan/checkout"
                className="flex items-center gap-1 text-teal-700 transition hover:text-teal-800"
              >
                <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-extrabold text-teal-700">ویژه</span>
                خرید اقساطی
              </Link>
              <Link
                href="/wallet"
                className="transition hover:text-teal-700"
              >
                کیف پول
              </Link>
              <Link
                href="/contact"
                className="transition hover:text-teal-700"
              >
                تماس با ما
              </Link>
            </nav>
          </div>
        </div>

        {/* Center: Desktop Instant Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden max-w-md flex-1 px-4 lg:block"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی طلا، سکه، دستبند، انگشتر..."
              className="w-full rounded-full border border-line bg-canvas/80 py-2 pe-4 ps-10 text-xs font-medium text-ink placeholder:text-muted/70 transition focus:border-teal-600 focus:bg-surface focus:outline-none"
            />
            <button
              type="submit"
              aria-label="جستجو"
              className="absolute start-3 text-muted hover:text-teal-700"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Left (RTL end): Actions Cluster */}
        <div dir="ltr" className="flex items-center gap-2 md:gap-3">
          <HeaderCartButton />

          {/* Desktop Wallet Link */}
          <Link
            href="/wallet"
            aria-label="کیف پول"
            className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 text-ink transition hover:bg-canvas md:flex"
          >
            <WalletIcon className="h-4 w-4 text-gold-600" />
            <span className="text-xs font-bold text-ink">کیف پول</span>
          </Link>

          {/* Mobile Search Button */}
          <span className="md:hidden">
            <Link
              href="/categories"
              aria-label="جستجو"
              className="grid h-10 w-10 place-items-center rounded-full text-ink/80 transition hover:bg-canvas"
            >
              <SearchIcon className="h-5 w-5" />
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
