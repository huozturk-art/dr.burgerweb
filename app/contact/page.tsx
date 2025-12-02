import ContactContent from "@/components/ContactContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "İletişim | Dr. Burger",
    description: "Bize ulaşın. Adres, telefon ve iletişim formu. Dr. Burger şubelerini haritada görüntüleyin.",
};

export default function ContactPage() {
    return <ContactContent />;
}
