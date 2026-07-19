import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartModal } from "@/components/cart/CartModal";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getCategoryTree, buildMockCategoryTree } from "@/lib/shop/category";

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "دیجی گلد | بازار آنلاین طلا",
  description:
    "دیجی گلد؛ پلتفرم خرید و فروش آنلاین طلا، سکه، شمش و مصنوعات از فروشندگان معتبر",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Top-level categories for the header's category dropdown. `Category/List`
  // only returns leaf/mid-level categories (no roots), so the tree endpoint's
  // top-level nodes are the real root categories (طلا/سکه/نقره today).
  const categories = await getCategoryTree().then((c) => c ?? buildMockCategoryTree());

  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <AuthProvider>
          <CartProvider>
            <Header categories={categories} />
            {/* pb gives room for the mobile bottom nav */}
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
            <CartModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
