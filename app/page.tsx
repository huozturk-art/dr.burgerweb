import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr. Burger - Ana Sayfa",
  description: "Dr. Burger ile gerçek burger deneyimini keşfedin. En taze malzemeler, eşsiz lezzetler.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      {/* Main Content Area - Updated Deployment */}
      {/* Diğer bölümler buraya eklenecek */}
      <Footer />
    </main>
  );
}
