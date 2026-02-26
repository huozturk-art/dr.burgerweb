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
import { TableProvider } from "@/context/TableContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <TableProvider>
          <DataProvider>
            <CartProvider>
              {children}
              <SpeedInsights />
            </CartProvider>
          </DataProvider>
        </TableProvider>
      </body>
    </html>
  );
}
