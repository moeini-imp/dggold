"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { AddressSelectModal } from "@/components/checkout/AddressSelectModal";
import { PaymentGatewayIcon } from "@/components/checkout/PaymentGatewayIcon";
import { GatewayRedirect } from "@/components/checkout/GatewayRedirect";
import { SearchSelect } from "@/components/ui/SearchSelect";
import { TruckIcon } from "@/components/ui/icons";
import type { PaymentGateway } from "@/lib/shop/payment";
import type { ShippingType } from "@/lib/shop/shipping";
import { ChevronLeft } from "@/components/ui/icons";
import { resolveCartLines } from "@/lib/api";
import { getProvinces, getCities, type Place } from "@/lib/shop/place";
import {
  createOrEditAddress,
  getAddresses,
  type Address,
} from "@/lib/shop/address";
import { formatToman, toEnglishDigits, toPersianDigits } from "@/lib/format";
import { addOrder, type AddOrderData } from "@/lib/shop/order";
import type { CartDisplayLine } from "@/lib/types";

export function CheckoutView({
  gateways,
  shippingTypes,
}: {
  gateways: PaymentGateway[];
  shippingTypes: ShippingType[];
}) {
  const router = useRouter();
  const { lines, hydrated, clear } = useCart();
  const { isAuthenticated, hydrated: authHydrated, phone, accessToken } =
    useAuth();
  const [details, setDetails] = useState<CartDisplayLine[]>([]);

  // Protect checkout: bounce unauthenticated users to login.
  useEffect(() => {
    if (authHydrated && !isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [authHydrated, isAuthenticated, router]);

  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [gateway, setGateway] = useState(gateways[0]?.key ?? "");
  const [shippingId, setShippingId] = useState(shippingTypes[0]?.id ?? null);
  const [submitted, setSubmitted] = useState(false);
  // Stable across retries so a repeated pay click can't create duplicate orders.
  const idempotencyKey = useRef<string>("");
  if (!idempotencyKey.current) {
    idempotencyKey.current =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [gatewayRedirect, setGatewayRedirect] = useState<AddOrderData | null>(
    null,
  );

  // province / city
  const [provinces, setProvinces] = useState<Place[]>([]);
  const [cities, setCities] = useState<Place[]>([]);
  const [province, setProvince] = useState<Place | null>(null);
  const [city, setCity] = useState<Place | null>(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // saved addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [addingNew, setAddingNew] = useState(false);
  const [addrModalOpen, setAddrModalOpen] = useState(false);

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) ?? null;
  // "new address" mode when the user is adding one or has none saved
  const newMode = addingNew || (!loadingAddresses && addresses.length === 0);

  // load saved addresses once authenticated
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    setLoadingAddresses(true);
    getAddresses(accessToken)
      .then((list) => {
        if (!active) return;
        setAddresses(list);
        const def = list.find((a) => a.isDefault) ?? list[0];
        setSelectedAddressId(def ? def.id : null);
      })
      .finally(() => active && setLoadingAddresses(false));
    return () => {
      active = false;
    };
  }, [accessToken]);

  useEffect(() => {
    let active = true;
    resolveCartLines(lines).then((d) => active && setDetails(d));
    return () => {
      active = false;
    };
  }, [lines]);

  // load provinces once authenticated
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    setLoadingProvinces(true);
    getProvinces(accessToken)
      .then((p) => active && setProvinces(p))
      .finally(() => active && setLoadingProvinces(false));
    return () => {
      active = false;
    };
  }, [accessToken]);

  // load cities when province changes
  useEffect(() => {
    if (!accessToken || !province) {
      setCities([]);
      return;
    }
    let active = true;
    setLoadingCities(true);
    getCities(accessToken, province.id)
      .then((c) => active && setCities(c))
      .finally(() => active && setLoadingCities(false));
    return () => {
      active = false;
    };
  }, [accessToken, province]);

  const itemsTotal = useMemo(
    () => details.reduce((s, l) => s + l.lineTotal, 0),
    [details],
  );
  const count = details.reduce((s, l) => s + l.quantity, 0);
  const shipping = shippingTypes.find((s) => s.id === shippingId) ?? null;
  const shippingCost = shipping?.cost ?? 0;
  const total = itemsTotal + shippingCost;

  const errors = {
    province: !province,
    city: !city,
    address: !address.trim(),
    postalCode: !/^\d{10}$/.test(postalCode.replace(/\D/g, "")),
  };
  const newAddressValid =
    !errors.province && !errors.city && !errors.address && !errors.postalCode;
  const isValid = newMode ? newAddressValid : !!selectedAddress;

  async function handlePay() {
    setSubmitted(true);
    setError("");
    if (details.length === 0 || !accessToken) return;

    const gatewayId = gateways.find((g) => g.key === gateway)?.id;
    if (!shippingId || !gatewayId) {
      setError("شیوه ارسال و درگاه پرداخت را انتخاب کنید.");
      return;
    }

    setPaying(true);
    try {
      // Resolve the address id: use the selected saved one, or create the new one.
      let addressId: number | undefined;
      if (newMode) {
        if (!newAddressValid || !province || !city) {
          setPaying(false);
          return;
        }
        const res = await createOrEditAddress(accessToken, {
          id: 0,
          title: `${province.name}، ${city.name}`,
          provinceName: province.name,
          provinceId: province.id,
          cityId: city.id,
          cityName: city.name,
          address,
          zipCode: postalCode,
          isDefault: true,
          latitude: 0,
          longitude: 0,
        });
        addressId = (res.data as { id?: number })?.id;
        if (!res.success || !addressId) {
          setError(res.errorMessage || "ذخیره آدرس ناموفق بود. دوباره تلاش کنید.");
          setPaying(false);
          return;
        }
      } else {
        if (!selectedAddress) {
          setPaying(false);
          return;
        }
        addressId = selectedAddress.id;
      }

      // Create the order → get the payment gateway URL, then redirect.
      const result = await addOrder(accessToken, {
        addressId,
        shippingTypeId: shippingId,
        paymentGatewayId: gatewayId,
        idempotencyKey: idempotencyKey.current,
        // Backend redirects here after the gateway: /receipt/success?id=… or
        // /receipt/failed?id=…
        callbackUrl: `${window.location.origin}/receipt`,
        products: details.map((l) => ({
          id: Number(l.productId),
          quantity: l.quantity,
        })),
      });

      if (result?.success && result.data?.redirectUrl) {
        clear();
        // Show the transitional hand-off view — it performs the actual
        // navigation/form-submit (GET vs POST depends on the gateway).
        setGatewayRedirect(result.data);
        return;
      }
      setError(
        result?.errorMessage ||
          result?.resultMessage ||
          "ثبت سفارش ناموفق بود. دوباره تلاش کنید.",
      );
      setPaying(false);
    } catch {
      setError("خطا در ثبت سفارش. دوباره تلاش کنید.");
      setPaying(false);
    }
  }

  if (gatewayRedirect) {
    return <GatewayRedirect data={gatewayRedirect} />;
  }

  if (!hydrated || !authHydrated || !isAuthenticated) {
    return <div className="py-24 text-center text-muted">در حال بارگذاری…</div>;
  }

  if (details.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="mb-4 text-lg font-bold text-ink">
          سبد خرید شما خالی است
        </p>
        <Link
          href="/"
          className="inline-block rounded-btn bg-teal-600 px-6 py-2.5 text-sm font-bold text-surface hover:bg-teal-700"
        >
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  const summary = (
    <div className="rounded-card bg-surface p-5 shadow-card">
      <h2 className="mb-4 font-bold text-ink">خلاصه سفارش</h2>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="text-muted">
          جمع کالاها ({toPersianDigits(count)} کالا)
        </span>
        <span className="font-medium text-ink tnum">
          {formatToman(itemsTotal)}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="text-muted">هزینه ارسال</span>
        {shippingCost > 0 ? (
          <span className="font-medium text-ink tnum">
            {formatToman(shippingCost)}
          </span>
        ) : (
          <span className="font-medium text-success">رایگان</span>
        )}
      </div>
      <div className="my-3 border-t border-line" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-bold text-ink">مبلغ قابل پرداخت</span>
        <span className="text-lg font-extrabold text-teal-700 tnum">
          {formatToman(total)}
        </span>
      </div>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      <button
        type="button"
        onClick={handlePay}
        disabled={paying}
        className="mt-5 block w-full rounded-btn bg-teal-600 py-3 text-center font-bold text-surface transition hover:bg-teal-700 disabled:opacity-60"
      >
        {paying ? "در حال ثبت…" : `پرداخت ${formatToman(total)}`}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-10 md:px-6 md:py-8">
      <div className="mb-8 hidden md:block">
        <CheckoutSteps active="checkout" />
      </div>

      <h1 className="mb-5 text-xl font-extrabold text-ink md:text-2xl">
        آدرس و پرداخت
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="min-w-0 space-y-5 md:col-span-2">
          {/* address */}
          <section className="rounded-card bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-ink">آدرس تحویل</h2>
              {!newMode && addresses.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setAddrModalOpen(true)}
                  className="flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
                >
                  تغییر آدرس
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            {loadingAddresses ? (
              <p className="py-6 text-center text-sm text-muted">
                در حال بارگذاری آدرس‌ها…
              </p>
            ) : !newMode && selectedAddress ? (
              // selected saved address
              <div className="rounded-card border border-teal-600 bg-teal-50 p-4">
                <p className="mb-1 font-bold text-teal-700">
                  {selectedAddress.title ||
                    `${selectedAddress.provinceName}، ${selectedAddress.cityName}`}
                </p>
                <p className="text-sm leading-relaxed text-ink">
                  {selectedAddress.address}
                </p>
                <p className="mt-1 text-xs text-muted tnum">
                  کد پستی: {toPersianDigits(selectedAddress.zipCode)}
                </p>
              </div>
            ) : (
              // new address form
              <div>
                {addresses.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setAddingNew(false)}
                    className="mb-3 flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
                  >
                    بازگشت به آدرس‌های من
                  </button>
                ) : null}
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                  <SearchSelect
                    label="استان"
                    placeholder="جستجوی استان"
                    items={provinces}
                    value={province?.id ?? null}
                    loading={loadingProvinces}
                    onSelect={(p) => {
                      setProvince(p);
                      setCity(null);
                    }}
                    error={
                      submitted && errors.province ? "استان را انتخاب کنید" : ""
                    }
                  />
                  <SearchSelect
                    label="شهر"
                    placeholder={
                      province ? "جستجوی شهر" : "ابتدا استان را انتخاب کنید"
                    }
                    items={cities}
                    value={city?.id ?? null}
                    disabled={!province}
                    loading={loadingCities}
                    onSelect={(c) => setCity(c)}
                    error={submitted && errors.city ? "شهر را انتخاب کنید" : ""}
                  />
                </div>

                <Field
                  label="آدرس"
                  error={submitted && errors.address ? "آدرس را وارد کنید" : ""}
                >
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    placeholder="آدرس کامل پستی"
                    className="w-full resize-none rounded-btn border border-line bg-canvas px-4 py-3 text-sm outline-none transition focus:border-teal-400"
                  />
                </Field>
                <Field
                  label="کد پستی"
                  error={
                    submitted && errors.postalCode
                      ? "کد پستی ۱۰ رقمی را وارد کنید"
                      : ""
                  }
                >
                  <input
                    value={toPersianDigits(postalCode)}
                    onChange={(e) =>
                      setPostalCode(
                        toEnglishDigits(e.target.value)
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      )
                    }
                    inputMode="numeric"
                    placeholder="۱۰ رقم"
                    className="w-full rounded-btn border border-line bg-canvas px-4 py-3 text-sm outline-none transition focus:border-teal-400 tnum"
                  />
                </Field>
              </div>
            )}
          </section>

          {/* shipping method */}
          {shippingTypes.length ? (
            <section className="rounded-card bg-surface p-5 shadow-card">
              <h2 className="mb-4 font-bold text-ink">شیوه ارسال</h2>
              <div className="space-y-3">
                {shippingTypes.map((s) => {
                  const selected = s.id === shippingId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShippingId(s.id)}
                      className={`flex w-full items-start gap-3 rounded-card border p-3 text-right transition ${
                        selected
                          ? "border-teal-600 bg-teal-50"
                          : "border-line hover:border-teal-300"
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                          selected
                            ? "bg-teal-600 text-surface"
                            : "bg-canvas text-muted"
                        }`}
                      >
                        <TruckIcon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-sm font-medium leading-relaxed text-ink">
                          {s.title}
                        </span>
                        {s.durationTime ? (
                          <span className="mt-0.5 block text-xs text-muted">
                            {s.durationTime}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-sm font-bold tnum">
                        {s.cost > 0 ? (
                          <span className="text-teal-700">
                            {formatToman(s.cost)}
                          </span>
                        ) : (
                          <span className="text-success">رایگان</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* payment gateway */}
          <section className="rounded-card bg-surface p-5 shadow-card">
            <h2 className="mb-4 font-bold text-ink">انتخاب درگاه پرداخت</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {gateways.map((g) => {
                const selected = g.key === gateway;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGateway(g.key)}
                    className={`flex min-w-0 items-center gap-3 rounded-card border p-3 text-right transition ${
                      selected
                        ? "border-teal-600 bg-teal-50"
                        : "border-line hover:border-teal-300"
                    }`}
                  >
                    <PaymentGatewayIcon
                      gatewayKey={g.key}
                      imageUrl={g.imageUrl}
                      name={g.name}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">
                        {g.name}
                      </span>
                      {g.description ? (
                        <span className="mt-0.5 block truncate text-xs text-muted">
                          {g.description}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        selected ? "border-teal-600" : "border-line"
                      }`}
                    >
                      {selected ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* summary + pay on mobile */}
          <div className="md:hidden">{summary}</div>
        </div>

        {/* summary aside (desktop) */}
        <aside className="hidden min-w-0 md:block">
          <div className="sticky top-20">{summary}</div>
        </aside>
      </div>

      <AddressSelectModal
        open={addrModalOpen}
        addresses={addresses}
        selectedId={selectedAddressId}
        onSelect={(id) => {
          setSelectedAddressId(id);
          setAddingNew(false);
        }}
        onAddNew={() => {
          setAddingNew(true);
          setAddrModalOpen(false);
        }}
        onClose={() => setAddrModalOpen(false)}
      />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}
