"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// --- Types ---

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
}

export interface SiteContent {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutText: string;
}

export interface Application {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    message: string;
    date: string;
}

interface DataContextType {
    // Products
    products: Product[];
    addProduct: (product: Omit<Product, "id">) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getProductsByCategory: (category: string) => Product[];

    // Branches
    branches: Branch[];
    addBranch: (branch: Omit<Branch, "id">) => void;
    updateBranch: (id: string, branch: Partial<Branch>) => void;
    deleteBranch: (id: string) => void;

    // Content
    siteContent: SiteContent;
    updateSiteContent: (content: Partial<SiteContent>) => void;

    // Applications
    applications: Application[];
    addApplication: (application: Omit<Application, "id" | "date">) => void;
    deleteApplication: (id: string) => void;
}

// --- Initial Data ---

const INITIAL_PRODUCTS: Product[] = [
    // A) Klasik Kırmızı Et Burgerler
    {
        id: "1",
        name: "Dr. Burger",
        description: "Burger Ekmeği, 110gr Burger Köftesi, Dr. Sos (30gr), Karamelize Soğan (20gr), Turşu (10gr), Iceberg (20gr).",
        price: 240,
        image: "/images/products/DSC04682.JPG.png",
        category: "Klasik Burgerler",
    },
    {
        id: "2",
        name: "Klasik Burger",
        description: "Burger Ekmeği, 110gr Burger Köftesi, Çıtır Soğan (10gr), Iceberg (20gr), Ketçap (15gr), Mayonez (15gr), Domates.",
        price: 220,
        image: "/images/products/DSC04682.JPG.png",
        category: "Klasik Burgerler",
    },
    {
        id: "3",
        name: "Dr. Cheese Burger",
        description: "Burger Ekmeği, 110gr Burger Köftesi, Dr. Sos (30gr), 2 Dilim Cheddar Peyniri (30gr), Turşu (10gr).",
        price: 260,
        image: "/images/products/DSC04715.png",
        category: "Klasik Burgerler",
    },
    {
        id: "4",
        name: "Mushroom Burger",
        description: "Burger Ekmeği, 110gr Burger Köftesi, Kremalı Mantar (50gr), Mayonez (30gr), Iceberg Marul (20gr), Turşu (10gr).",
        price: 270,
        image: "/images/products/DSC04700.png",
        category: "Klasik Burgerler",
    },

    // B) Özel Seriler
    {
        id: "5",
        name: "Big Burger",
        description: "Burger Ekmeği, 110gr Köfte, Dr. Sos, Pastırma (20gr), Karamelize Soğan, Kibrit Patates, 4 Dilim Cheddar (60gr), Turşu.",
        price: 340,
        image: "/images/products/DSC04693.png",
        category: "Özel Seriler",
    },
    {
        id: "6",
        name: "Otto Burger",
        description: "Burger Ekmeği, 110gr Köfte, Dr. Sos, Pastırma (20gr), Soğan Turşusu (20gr), Kibrit Patates (20gr).",
        price: 330,
        image: "/images/products/DSC04693.png",
        category: "Özel Seriler",
    },
    {
        id: "7",
        name: "Tiftik Burger",
        description: "Burger Ekmeği, 110gr Dana Tiftik Et, Dr. Sos (30gr), BBQ Sos (20gr), Soğan Turşusu (20gr).",
        price: 350,
        image: "/images/products/DSC04706.png",
        category: "Özel Seriler",
    },
    {
        id: "8",
        name: "Smoke Burger",
        description: "Burger Ekmeği, 110gr Köfte, 60gr Dana Füme Et, 2 Dilim Cheddar (30gr), Barbekü Sos (30gr), Çıtır Soğan.",
        price: 340,
        image: "/images/products/DSC04703.png",
        category: "Özel Seriler",
    },

    // C) Tavuk Burgerler
    {
        id: "9",
        name: "Chicken Burger",
        description: "Burger Ekmeği, 40gr Pane, 80gr Tavuk Göğsü, Mayonez (30gr), Sweet Chili Sos (20gr), Turşu, Iceberg.",
        price: 200,
        image: "/images/products/DSC04682.JPG.png",
        category: "Tavuk Burgerler",
    },
    {
        id: "10",
        name: "Cheese Chicken Burger",
        description: "Chicken Burger içeriğine ek olarak 2 Dilim Cheddar Peyniri (30gr).",
        price: 220,
        image: "/images/products/DSC04715.png",
        category: "Tavuk Burgerler",
    },

    // D) Fire (Acı) Serisi
    {
        id: "11",
        name: "Fire Burger",
        description: "110gr Köfte, Sriracha Sos (30gr), Acılı Mayonez Sos (20gr), Soğan Turşusu (20gr), Jalapeno (10gr).",
        price: 270,
        image: "/images/products/DSC04703.png",
        category: "Fire (Acı) Serisi",
    },
    {
        id: "12",
        name: "Chicken Fire Burger",
        description: "80gr Tavuk Göğsü, 40gr Pane, Sriracha Sos, Acılı Mayonez, Soğan Turşusu, Jalapeno Biber, Iceberg.",
        price: 230,
        image: "/images/products/DSC04703.png",
        category: "Fire (Acı) Serisi",
    },

    // Yan Ürünler (Korundu)
    {
        id: "13",
        name: "Çıtır Patates",
        description: "Özel baharat çeşnisi ile hazırlanmış altın sarısı patates kızartması.",
        price: 90,
        image: "/images/products/DSC04754.png",
        category: "Yan Ürünler",
    },
    {
        id: "14",
        name: "Soğan Halkası",
        description: "8 adet çıtır soğan halkası, özel dip sos ile.",
        price: 110,
        image: "/images/products/DSC04785.png",
        category: "Yan Ürünler",
    },
    {
        id: "15",
        name: "Mozzarella Sticks",
        description: "Çıtır kaplamalı mozzarella peyniri.",
        price: 130,
        image: "/images/products/DSC04805.JPG.png",
        category: "Yan Ürünler",
    },
];

const INITIAL_BRANCHES: Branch[] = [
    {
        id: "1",
        name: "Kadıköy Merkez",
        address: "Bağdat Caddesi No: 123, Kadıköy, İstanbul",
        phone: "+90 (216) 123 45 67",
        email: "kadikoy@drburger.com.tr"
    },
    {
        id: "2",
        name: "Beşiktaş Şube",
        address: "Çarşı İçi Caddesi No: 45, Beşiktaş, İstanbul",
        phone: "+90 (212) 987 65 43",
        email: "besiktas@drburger.com.tr"
    }
];

const INITIAL_CONTENT: SiteContent = {
    heroTitle: "Anne Eli Değmiş Gibi\nGerçek Burger Lezzeti",
    heroSubtitle: "Dondurulmuş ürün yok, katkı maddesi yok. Günlük taze ekmek, %100 dana eti ve şefimizin özel soslarıyla hazırlanan sağlıklı burger deneyimi.",
    aboutTitle: "Neden Dr. Burger?",
    aboutText: "Dr. Burger’da her şey evinizde hazırlanmış hissi verir, ama profesyonel bir ustalığın dokunuşuyla sunulur. Ne çok yağlı ne de kuru; tam kıvamında, bol malzemeli ve doyurucu… Bizim için her burger, lezzetli bir anı yaratmak demektir. İşte bu yüzden Dr. Burger, “ev yapımı burger sevenlerin” buluşma noktasıdır."
};

// --- Context ---

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
    const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_CONTENT);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const loadData = (key: string, setter: any) => {
            const saved = localStorage.getItem(key);
            if (saved) {
                try {
                    setter(JSON.parse(saved));
                } catch (e) {
                    console.error(`Failed to parse ${key}`, e);
                }
            }
        };

        // Updated keys to v4 to force refresh and fix potential corruption
        loadData("dr_burger_products_v4", setProducts);
        loadData("dr_burger_branches_v4", setBranches);
        loadData("dr_burger_content_v4", setSiteContent);
        loadData("dr_burger_applications_v4", setApplications);
        setIsInitialized(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("dr_burger_products_v4", JSON.stringify(products));
            localStorage.setItem("dr_burger_branches_v4", JSON.stringify(branches));
            localStorage.setItem("dr_burger_content_v4", JSON.stringify(siteContent));
            localStorage.setItem("dr_burger_applications_v4", JSON.stringify(applications));
        }
    }, [products, branches, siteContent, applications, isInitialized]);

    // Product Actions
    const addProduct = (newProduct: Omit<Product, "id">) => {
        const product = { ...newProduct, id: Math.random().toString(36).substr(2, 9) };
        setProducts((prev) => [...prev, product]);
    };

    const updateProduct = (id: string, updatedFields: Partial<Product>) => {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
    };

    const deleteProduct = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const getProductsByCategory = (category: string) => {
        return products.filter((p) => p.category === category);
    };

    // Branch Actions
    const addBranch = (newBranch: Omit<Branch, "id">) => {
        const branch = { ...newBranch, id: Math.random().toString(36).substr(2, 9) };
        setBranches((prev) => [...prev, branch]);
    };

    const updateBranch = (id: string, updatedFields: Partial<Branch>) => {
        setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b)));
    };

    const deleteBranch = (id: string) => {
        setBranches((prev) => prev.filter((b) => b.id !== id));
    };

    // Content Actions
    const updateSiteContent = (content: Partial<SiteContent>) => {
        setSiteContent((prev) => ({ ...prev, ...content }));
    };

    // Application Actions
    const addApplication = (newApplication: Omit<Application, "id" | "date">) => {
        const application = {
            ...newApplication,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
        };
        setApplications((prev) => [application, ...prev]);
    };

    const deleteApplication = (id: string) => {
        setApplications((prev) => prev.filter((app) => app.id !== id));
    };

    return (
        <DataContext.Provider
            value={{
                products,
                addProduct,
                updateProduct,
                deleteProduct,
                getProductsByCategory,
                branches,
                addBranch,
                updateBranch,
                deleteBranch,
                siteContent,
                updateSiteContent,
                applications,
                addApplication,
                deleteApplication,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
