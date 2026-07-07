/** Province/city lookups (via our proxy, which forwards the bearer token). */

export interface Place {
  id: number;
  name: string;
}

/** Normalize an unknown API payload (envelope/array/nested list, varied casing). */
function normalize(raw: unknown): Place[] {
  const data = (raw as { data?: unknown })?.data;
  const arr: unknown[] = Array.isArray(raw)
    ? raw
    : Array.isArray(data)
      ? data
      : Array.isArray((data as { list?: unknown })?.list)
        ? ((data as { list: unknown[] }).list)
        : Array.isArray((raw as { list?: unknown })?.list)
          ? ((raw as { list: unknown[] }).list)
          : [];
  return arr
    .map((x): Place | null => {
      const o = x as Record<string, unknown>;
      const id =
        o.id ?? o.Id ?? o.provinceId ?? o.ProvinceId ?? o.cityId ?? o.CityId;
      const name =
        o.name ?? o.Name ?? o.title ?? o.Title ?? o.persianName ?? o.PersianName;
      if (id == null || name == null) return null;
      return { id: Number(id), name: String(name) };
    })
    .filter((p): p is Place => p !== null);
}

async function authedGet(url: string, token: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Authorization: `bearer ${token}` },
  });
  return res.json();
}

export async function getProvinces(token: string): Promise<Place[]> {
  return normalize(await authedGet("/api/place/provinces", token));
}

export async function getCities(
  token: string,
  provinceId: number,
): Promise<Place[]> {
  return normalize(
    await authedGet(`/api/place/cities?provinceId=${provinceId}`, token),
  );
}
