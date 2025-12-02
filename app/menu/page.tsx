import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import MenuContent from "@/components/MenuContent";

export const metadata: Metadata = {
    title: "Menü | Dr. Burger",
    description: "Dr. Burger'in eşsiz lezzetlerini keşfedin. Premium burgerler, çıtır yan ürünler ve daha fazlası.",
};

const MenuPage = () => {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <MenuContent />
            <Footer />
        </main>
    );
};

export default MenuPage;
