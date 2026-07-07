import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <AuthProvider>
          <CartProvider>
            <Header />
            {/* pb gives room for the mobile bottom nav */}
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
