"use client";

import { useEffect, useRef } from "react";
import type { AddOrderData } from "@/lib/shop/order";

/**
 * Full-screen hand-off to the payment gateway.
 * - GET gateways (most): navigate directly to redirectUrl.
 * - POST gateways (e.g. تارا): the gateway requires a real form submission
 *   (not a fetch/redirect) carrying `formFields` as hidden inputs, so we
 *   build and auto-submit a hidden <form> — same mechanism a classic
 *   server-rendered redirect page would use.
 * A manual button is offered in both cases in case the auto hand-off is
 * blocked or delayed.
 */
export function GatewayRedirect({ data }: { data: AddOrderData }) {
  const formRef = useRef<HTMLFormElement>(null);
  const isPost = data.redirectMethod?.toUpperCase() === "POST";

  useEffect(() => {
    if (isPost) {
      formRef.current?.submit();
    } else {
      window.location.assign(data.redirectUrl);
    }
    // Only ever run once per mount — this view exists solely to redirect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span
        aria-hidden
        className="h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600"
      />
      <p className="font-medium text-ink">در حال انتقال به درگاه پرداخت…</p>
      <p className="max-w-xs text-sm text-muted">
        اگر انتقال به‌صورت خودکار انجام نشد، روی دکمه زیر بزنید.
      </p>

      {isPost ? (
        <form
          ref={formRef}
          method="POST"
          action={data.redirectUrl}
          className="hidden"
        >
          {Object.entries(data.formFields ?? {}).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        </form>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (isPost) formRef.current?.submit();
          else window.location.assign(data.redirectUrl);
        }}
        className="rounded-btn bg-teal-600 px-6 py-2.5 text-sm font-bold text-surface transition hover:bg-teal-700"
      >
        انتقال دستی
      </button>
    </div>
  );
}
