import AboutContent from "@/components/AboutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hakkımızda | Dr. Burger",
    description: "Dr. Burger'in hikayesi, vizyonu ve lezzet sırları. %100 dana eti ve günlük taze malzemelerle hazırlanan burgerlerimizin arkasındaki tutkuyu keşfedin.",
};

import GallerySection from "@/components/GallerySection";

export default function AboutPage() {
    return (
        <>
            <AboutContent />
            <GallerySection />
        </>
    );
}
