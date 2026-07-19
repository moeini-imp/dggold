"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserInfo } from "@/lib/shop/user";
import { toPersianDigits } from "@/lib/format";

/** Logged-out: "ورود / ثبت‌نام" pill. Logged-in: avatar + name/phone pill. */
export function UserMenu() {
  const { isAuthenticated, hydrated, phone, accessToken } = useAuth();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const info = accessToken
        ? await getUserInfo(accessToken)
        : { fullName: null };
      if (active) setName(info.fullName);
    })();
    return () => {
      active = false;
    };
  }, [accessToken]);

  if (!hydrated) return <span className="h-10 w-24" aria-hidden />;

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="flex items-center whitespace-nowrap rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-teal-700"
      >
        ورود / ثبت‌نام
      </Link>
    );
  }

  const display = name || (phone ? toPersianDigits(phone) : "");

  return (
    <Link
      href="/profile"
      className="flex items-center gap-2 rounded-full border border-line bg-canvas py-1.5 pr-1.5 pl-4"
    >
      <span className="grid h-6.5 w-6.5 place-items-center rounded-full bg-teal-600 text-[12px] font-bold text-gold-300">
        {display ? display.charAt(0) : "؟"}
      </span>
      <span dir={name ? "auto" : "ltr"} className="whitespace-nowrap text-[13px] font-semibold text-ink tnum">
        {display}
      </span>
    </Link>
  );
}
