/**
 * Domain types for the DG Gold marketplace.
 *
 * Core model: a Product can be offered by many Vendors. Each VendorOffer
 * carries its own price/stock. The product detail screen compares offers
 * ("فروشندگان دیگر"), and the cart/checkout work against a chosen offer.
 *
 * These shapes are the contract the mock layer fulfills today and the real
 * API should fulfill tomorrow — keep them stable.
 */

export type Karat = "18" | "24" | "750" | "925" | "999";

export interface Category {
  id: string;
  slug: string;
  name: string; // fa
  /** caratb-style badge shown on the home category circles, e.g. "18k" */
  badge?: string;
  icon?: string; // icon key or image url
}

export interface Vendor {
  id: string;
  slug: string;
  name: string; // fa, e.g. "عباس طلا"
  avatarUrl?: string;
  address?: string;
  phone?: string;
  rating?: number;
}

/** One vendor's offer for a product. */
export interface VendorOffer {
  vendorId: string;
  vendorName: string;
  price: number; // Toman
  originalPrice?: number; // Toman, for strikethrough/discount
  inStock: boolean;
  /** Max purchasable quantity for this offer. Defaults to a sane cap. */
  maxQuantity?: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string; // fa
  imageUrl: string; // primary image (used on list cards)
  images?: string[]; // gallery; falls back to [imageUrl] when absent
  categoryId: string;
  karat?: Karat;
  weightGram?: number;
  /** اجرت — making fee as a percent of the net metal value. */
  makingFeePercent?: number;
  /** مالیات — tax as a percent of the making fee. Defaults to 10. */
  taxPercent?: number;
  description?: string;
  /** Sorted ascending by price; first item is the best/default offer. */
  offers: VendorOffer[];
}

/** Decomposition of a final gold price into metal value + اجرت + مالیات. */
export interface PriceBreakdown {
  weightGram?: number;
  netPrice: number; // قیمت خالص — metal value
  makingFeePercent: number; // اجرت %
  makingFee: number; // اجرت amount
  taxPercent: number; // مالیات %
  tax: number; // مالیات amount
  finalPrice: number; // قیمت نهایی
}

/** Convenience view of a product joined to its cheapest offer (list cards). */
export interface ProductListItem {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  vendorName: string;
  offerCount: number;
}

/** Display snapshot stored on a cart line for products not in the mock catalog
 *  (i.e. real API products), so the cart can render without a catalog lookup. */
export interface CartLineMeta {
  slug?: string;
  title: string;
  imageUrl: string;
  vendorName: string;
  unitPrice: number;
  creditUnitPrice?: number;
  originalUnitPrice?: number;
  maxQuantity: number;
}

export interface CartLine {
  productId: string;
  vendorId: string;
  quantity: number;
  meta?: CartLineMeta;
}

/** A cart line resolved to display data (joined to product + chosen offer). */
export interface CartDisplayLine {
  productId: string;
  vendorId: string;
  slug: string;
  title: string;
  imageUrl: string;
  vendorName: string;
  unitPrice: number;
  creditUnitPrice?: number;
  originalUnitPrice?: number;
  quantity: number;
  maxQuantity: number;
  lineTotal: number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled";

export interface OrderItem {
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
  vendorName: string;
}

export interface Order {
  id: string;
  code: string; // e.g. "123123"
  createdAt: string; // ISO; rendered as Jalali
  status: OrderStatus;
  contactPhone: string;
  shipTo: string;
  total: number;
  items: OrderItem[];
}

export interface UserProfile {
  fullName: string;
  phone: string;
  nationalId?: string; // کدملی
  address?: string;
  postalCode?: string;
}
