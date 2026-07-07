import type { Category, Product, Vendor } from "@/lib/types";

/** Category circles / category grid. */
export const categories: Category[] = [
  { id: "c1", slug: "shemsh-plak-18", name: "شمش و پلاک طلا", badge: "18k" },
  { id: "c2", slug: "shemsh-24", name: "شمش طلا", badge: "24k" },
  { id: "c3", slug: "noghre-products", name: "مصنوعات نقره", badge: "925" },
  { id: "c4", slug: "shemsh-noghre", name: "شمش نقره", badge: "999" },
  { id: "c5", slug: "tala-products", name: "مصنوعات طلا", badge: "18k" },
  { id: "c6", slug: "tala-abshode", name: "طلای آبشده" },
  { id: "c7", slug: "sekke-bahar", name: "سکه بهار آزادی" },
  { id: "c8", slug: "sekke-parsian", name: "سکه پارسیان", badge: "18k" },
  { id: "c9", slug: "alango", name: "النگو" },
  { id: "c10", slug: "gardanband", name: "گردنبند" },
  { id: "c11", slug: "bachegane", name: "بچگانه" },
  { id: "c12", slug: "espvar", name: "اسپورت" },
];

export const vendors: Vendor[] = [
  {
    id: "v1",
    slug: "abbas-tala",
    name: "عباس طلا",
    address: "تهران، بازار بزرگ",
    phone: "0912345678",
    rating: 4.7,
  },
  {
    id: "v2",
    slug: "asghar-talaforush",
    name: "اصغر طلافروش",
    phone: "0913000001",
    rating: 4.5,
  },
  {
    id: "v3",
    slug: "asghar-talayan",
    name: "اصغر طلایان",
    phone: "0913000002",
    rating: 4.6,
  },
  {
    id: "v4",
    slug: "asghar-farhadi",
    name: "اصغر فرهادی",
    phone: "0913000003",
    rating: 4.2,
  },
  {
    id: "v5",
    slug: "amin-zar",
    name: "امین زر",
    phone: "0913000004",
    rating: 4.8,
  },
];

/** Image tone passed to the gold-gradient placeholder (no real assets yet). */
type Tone = "gold" | "coin" | "bar" | "silver";

interface Seed {
  slug: string;
  title: string;
  categoryId: string;
  tone: Tone;
  weightGram?: number;
  karat?: Product["karat"];
  base: number; // base price; offers fan out around it
  original?: number;
}

const seeds: Seed[] = [
  {
    slug: "shemsh-18-marbar-0070",
    title: "شمش طلای ۱۸ عیار ماربر (هخامنشی) وزن ۰.۰۷۰ گرم",
    categoryId: "c8",
    tone: "coin",
    weightGram: 0.07,
    karat: "18",
    base: 1470400,
    original: 1481240,
  },
  {
    slug: "shemsh-18-marbar-0050",
    title: "شمش طلای ۱۸ عیار ماربر (هخامنشی) وزن ۰.۰۵۰ گرم",
    categoryId: "c8",
    tone: "coin",
    weightGram: 0.05,
    karat: "18",
    base: 1057200,
    original: 1064930,
  },
  {
    slug: "shemsh-18-aminzar-0050",
    title: "شمش طلای ۱۸ عیار امین زر (هخامنشی) وزن ۰.۰۵۰ گرم",
    categoryId: "c8",
    tone: "bar",
    weightGram: 0.05,
    karat: "18",
    base: 1024200,
    original: 1034530,
  },
  {
    slug: "shemsh-18-aminzar-0030",
    title: "شمش طلای ۱۸ عیار امین زر (هخامنشی) وزن ۰.۰۳۰ گرم",
    categoryId: "c8",
    tone: "bar",
    weightGram: 0.03,
    karat: "18",
    base: 640200,
    original: 646630,
  },
  {
    slug: "abshode-750-5790",
    title: "طلای آبشده - عیار ۷۵۰ - کد انگ ۸۷۹۸۶۸ - وزن ۵.۷۹۰ گرم",
    categoryId: "c6",
    tone: "gold",
    weightGram: 5.79,
    karat: "750",
    base: 107319300,
    original: 108413000,
  },
  {
    slug: "abshode-750-4820",
    title: "طلای آبشده - عیار ۷۵۰ - کد انگ ۸۷۹۸۶۸ - وزن ۴.۸۲۰ گرم",
    categoryId: "c6",
    tone: "gold",
    weightGram: 4.82,
    karat: "750",
    base: 89344000,
    original: 90486080,
  },
  {
    slug: "abshode-750-3460",
    title: "طلای آبشده - عیار ۷۵۰ - کد انگ ۸۷۹۸۶۸ - وزن ۳.۴۶۰ گرم",
    categoryId: "c6",
    tone: "gold",
    weightGram: 3.46,
    karat: "750",
    base: 64141400,
    original: 64959590,
  },
  {
    slug: "venus-plak-18",
    title: "پلاک طلا ونوس ۱۸ عیار طرح شاخه گل وزن ۱.۰۰۰ گرم",
    categoryId: "c1",
    tone: "bar",
    weightGram: 1.0,
    karat: "18",
    base: 18540000,
    original: 18720000,
  },
  {
    slug: "nim-sekke-bahar",
    title: "نیم سکه بهار آزادی طرح جدید",
    categoryId: "c7",
    tone: "coin",
    karat: "750",
    base: 41500000,
  },
  {
    slug: "sekke-emami",
    title: "سکه تمام بهار آزادی طرح امامی",
    categoryId: "c7",
    tone: "coin",
    karat: "750",
    base: 82000000,
    original: 82900000,
  },
  {
    slug: "noghre-plak-999",
    title: "شمش نقره ۹۹۹ خالص وزن ۵۰ گرم",
    categoryId: "c4",
    tone: "silver",
    weightGram: 50,
    karat: "999",
    base: 5400000,
  },
  {
    slug: "gardanband-tala-18",
    title: "گردنبند طلا ۱۸ عیار طرح قلب وزن ۲.۵ گرم",
    categoryId: "c10",
    tone: "gold",
    weightGram: 2.5,
    karat: "18",
    base: 46300000,
    original: 47000000,
  },
];

/** Build offers for a product by fanning vendors out around the base price. */
function buildOffers(seed: Seed) {
  const spreads = [
    { v: vendors[0], delta: 0 },
    { v: vendors[1], delta: 0.018 },
    { v: vendors[2], delta: -0.004 },
    { v: vendors[3], delta: 0.012 },
    { v: vendors[4], delta: 0.026 },
  ];
  return spreads
    .map(({ v, delta }, i) => ({
      vendorId: v.id,
      vendorName: v.name,
      price: Math.round((seed.base * (1 + delta)) / 100) * 100,
      originalPrice: seed.original
        ? Math.round((seed.original * (1 + delta)) / 100) * 100
        : undefined,
      inStock: true,
      // limited per-vendor stock so the "حداکثر" cap is reachable
      maxQuantity: 3 + (i % 3),
    }))
    .sort((a, b) => a.price - b.price);
}

// اجرت (making fee %) by category: bullion/coins low, jewelry high.
const feeByCategory: Record<string, number> = {
  c6: 3, // آبشده
  c7: 5, // سکه بهار آزادی
  c8: 7, // سکه پارسیان / شمش ماربر
  c1: 7, // شمش و پلاک
  c4: 8, // نقره
  c10: 18, // گردنبند (مصنوعات)
};

// A small gallery per product: primary tone + a couple of alternates.
function buildImages(tone: Tone): string[] {
  const alts: Tone[] = ["gold", "bar", "coin"];
  const set = [tone, ...alts.filter((t) => t !== tone)].slice(0, 3);
  return set.map((t) => `placeholder:${t}`);
}

export const products: Product[] = seeds.map((seed, i) => ({
  id: `p${i + 1}`,
  slug: seed.slug,
  title: seed.title,
  imageUrl: `placeholder:${seed.tone}`,
  images: buildImages(seed.tone),
  categoryId: seed.categoryId,
  karat: seed.karat,
  weightGram: seed.weightGram,
  makingFeePercent: feeByCategory[seed.categoryId] ?? 10,
  taxPercent: 10,
  description:
    "این محصول از فروشندگان معتبر بازار طلای تهران عرضه می‌شود. قیمت بر اساس نرخ روز طلا و وزن کالا محاسبه شده و قابل مقایسه میان فروشندگان مختلف است.",
  offers: buildOffers(seed),
}));
