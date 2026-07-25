import type { Metadata } from "next";
import Script from "next/script";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartModal } from "@/components/cart/CartModal";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getCategoryTree, buildMockCategoryTree } from "@/lib/shop/category";

export const dynamic = "force-dynamic";

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
  const categories = await getCategoryTree().then((c) =>
    c && c.length > 0 ? c : buildMockCategoryTree(),
  );

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
        {/* Goftino live-chat widget (سامانه گفتگوی آنلاین) */}
        <Script
          id="goftino-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(){var i="hxftLQ",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();`,
          }}
        />
      </body>
    </html>
  );
}
