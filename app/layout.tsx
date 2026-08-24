import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { ToasterWrapper } from "@/components/ToasterWrapper";

export const metadata: Metadata = {
  title: "AMBUR Leather Goods | Premium Leather Products from Tamil Nadu",
  description: "Handcrafted premium leather goods from Ambur, Tamil Nadu. Shop genuine leather slippers, sandals, shoes, belts, wallets, and bags. Order on WhatsApp.",
  keywords: "leather goods, leather slippers, leather sandals, leather shoes, leather belts, leather wallets, leather bags, Ambur leather, Tamil Nadu leather",
  openGraph: {
    title: "AMBUR Leather Goods",
    description: "Premium Leather Products from Ambur, Tamil Nadu",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToasterWrapper />
        </CartProvider>
      </body>
    </html>
  );
}
