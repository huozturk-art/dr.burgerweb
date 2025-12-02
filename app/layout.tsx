import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dr. Burger - Premium Burger Deneyimi",
  description: "En taze malzemelerle hazırlanan premium burgerler. Dr. Burger lezzetini keşfedin.",
};

import { CartProvider } from "@/context/CartContext";
import { DataProvider } from "@/context/DataContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} antialiased`}
      >
        <DataProvider>
          <CartProvider>
            {children}
            <SpeedInsights />
          </CartProvider>
        </DataProvider>
      </body>
    </html>
  );
}
