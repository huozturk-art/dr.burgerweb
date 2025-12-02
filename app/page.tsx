import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

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
