/** Address create/edit via our proxy (forwards the bearer token). */

export interface AddressInput {
  id: number; // 0 for a new address
  title: string;
  provinceName: string;
  provinceId: number;
  cityId: number;
  cityName: string;
  address: string;
  zipCode: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

/** A saved address (list item) — same shape as the create input, id required. */
export type Address = AddressInput;

export interface AddressResult {
  success: boolean;
  errorMessage?: string | null;
  data?: unknown;
}

/** Fetch the user's saved addresses. */
export async function getAddresses(token: string): Promise<Address[]> {
  const res = await fetch("/api/address/list", {
    headers: { Authorization: `bearer ${token}` },
  });
  const json = (await res.json()) as { data?: unknown };
  const raw = json?.data;
  const arr: unknown[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { list?: unknown })?.list)
      ? ((raw as { list: unknown[] }).list)
      : [];
  return arr.filter(
    (a): a is Address =>
      !!a && typeof (a as Address).id === "number",
  );
}

/** Create (id:0) or edit an address. */
export async function createOrEditAddress(
  token: string,
  input: AddressInput,
): Promise<AddressResult> {
  const res = await fetch("/api/address/create-edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  return (await res.json()) as AddressResult;
}
