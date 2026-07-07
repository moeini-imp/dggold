"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  ChevronLeft,
  LogoutIcon,
  PackageIcon,
  UserIcon,
} from "@/components/ui/icons";
import { toPersianDigits } from "@/lib/format";

export function ProfileView() {
  const router = useRouter();
  const { isAuthenticated, hydrated, phone, logout } = useAuth();
  // Set while the user logs out so the auth guard below doesn't race the
  // navigation to home and bounce them to /login instead.
  const leaving = useRef(false);

  useEffect(() => {
    if (hydrated && !isAuthenticated && !leaving.current) {
      router.replace("/login?redirect=/profile");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return <div className="py-24 text-center text-muted">در حال بارگذاری…</div>;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-6 md:py-10">
      {/* user info */}
      <div className="flex flex-col items-center gap-3 rounded-card bg-surface p-6 text-center shadow-card">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-teal-50 text-teal-700">
          <UserIcon className="h-9 w-9" />
        </span>
        <div>
          <p className="font-bold text-ink">حساب کاربری</p>
          {phone ? (
            <p dir="ltr" className="mt-1 text-sm text-muted tnum">
              {toPersianDigits(phone)}
            </p>
          ) : null}
        </div>
      </div>

      {/* menu */}
      <div className="mt-5 space-y-3">
        <Link
          href="/profile/orders"
          className="flex items-center gap-3 rounded-card bg-surface p-4 shadow-card transition hover:shadow-pop"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <PackageIcon className="h-6 w-6" />
          </span>
          <span className="flex-1 font-medium text-ink">سفارش‌های من</span>
          <ChevronLeft className="h-5 w-5 text-muted" />
        </Link>

        <button
          type="button"
          onClick={() => {
            leaving.current = true;
            logout();
            // Hard navigation so the auth guard doesn't race us to /login.
            window.location.assign("/");
          }}
          className="flex w-full items-center gap-3 rounded-card bg-surface p-4 text-right shadow-card transition hover:shadow-pop"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-danger">
            <LogoutIcon className="h-6 w-6" />
          </span>
          <span className="flex-1 font-medium text-danger">خروج از حساب</span>
        </button>
      </div>
    </div>
  );
}
