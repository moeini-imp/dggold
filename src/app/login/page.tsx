import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginView } from "@/components/auth/LoginView";

export const metadata: Metadata = {
  title: "ورود / ثبت‌نام | دیجی گلد",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted">در حال بارگذاری…</div>
      }
    >
      <LoginView />
    </Suspense>
  );
}
