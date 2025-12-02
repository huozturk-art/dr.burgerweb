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

    // Categories
    categories: string[];
    addCategory: (category: string) => void;
    deleteCategory: (category: string) => void;
}

// --- Initial Data ---

const INITIAL_PRODUCTS: Product[] = [
    // A) Klasik Burgerler
    {
        id: "1",
        name: "Dr. Burger",
        description: "Burger Ekmeği, 110gr Burger Köftesi, Dr. Sos (30gr), Karamelize Soğan (20gr), Turşu (10gr), Iceberg (20gr).",
        price: 240,
        image: "/images/products/Dr Burger.png",
        category: "Klasik Burgerler",
    },
    {
        id: "2",
        name: "Klasik Burger",
        description: "Burger Ekmeği, 110gr Burger Köftesi, Çıtır Soğan (10gr), Iceberg (20gr), Ketçap (15gr), Mayonez (15gr), Domates.",
        price: 220,
        image: "/images/products/Classic burger.png",
        category: "Klasik Burgerler",
    },
    {
        id: "3",
        name: "Cheese Burger",
        description: "Burger Ekmeği, 110gr Burger Köftesi, Dr. Sos (30gr), 2 Dilim Cheddar Peyniri (30gr), Turşu (10gr).",
        price: 260,
        image: "/images/products/Cheese burger.png",
        category: "Klasik Burgerler",
    },
    {
        id: "4",
        name: "Mushroom Burger",
        description: "Burger Ekmeği, 110gr Burger Köftesi, Kremalı Mantar (50gr), Mayonez (30gr), Iceberg Marul (20gr), Turşu (10gr).",
        price: 270,
        image: "/images/products/Mushroom burger.png",
        category: "Klasik Burgerler",
    },

    // B) Özel Seriler
    {
        id: "5",
        name: "Big Burger",
        description: "Burger Ekmeği, 110gr Köfte, Dr. Sos, Pastırma (20gr), Karamelize Soğan, Kibrit Patates, 4 Dilim Cheddar (60gr), Turşu.",
        price: 340,
        image: "/images/products/Big burger.png",
        category: "Özel Seriler",
    },
    {
        id: "6",
        name: "Otto Burger",
        description: "Burger Ekmeği, 110gr Köfte, Dr. Sos, Pastırma (20gr), Soğan Turşusu (20gr), Kibrit Patates (20gr).",
        price: 330,
        image: "/images/products/Otto burger.png",
        category: "Özel Seriler",
    },
    {
        id: "7",
        name: "Tiftik Burger",
        description: "Burger Ekmeği, 110gr Dana Tiftik Et, Dr. Sos (30gr), BBQ Sos (20gr), Soğan Turşusu (20gr).",
        price: 350,
        image: "/images/products/Tiftik burger.png",
        category: "Özel Seriler",
    },
    {
        id: "8",
        name: "Smoke BBQ Burger",
        description: "Burger Ekmeği, 110gr Köfte, 60gr Dana Füme Et, 2 Dilim Cheddar (30gr), Barbekü Sos (30gr), Çıtır Soğan.",
        price: 340,
        image: "/images/products/SmokeBBQ burger.png",
        category: "Özel Seriler",
    },

    // C) Tavuk Burgerler
    {
        id: "9",
        name: "Chicken Burger",
        description: "Burger Ekmeği, 40gr Pane, 80gr Tavuk Göğsü, Mayonez (30gr), Sweet Chili Sos (20gr), Turşu, Iceberg.",
        price: 200,
        image: "/images/products/Chicken burger.png",
        category: "Tavuk Burgerler",
    },
    {
        id: "10",
        name: "Cheese Chicken Burger",
        description: "Chicken Burger içeriğine ek olarak 2 Dilim Cheddar Peyniri (30gr).",
        price: 220,
        image: "/images/products/Cheese Chicken Burger.png",
        category: "Tavuk Burgerler",
    },

    // D) Fire (Acı) Serisi
    {
        id: "11",
        name: "Fire Burger",
        description: "110gr Köfte, Sriracha Sos (30gr), Acılı Mayonez Sos (20gr), Soğan Turşusu (20gr), Jalapeno (10gr).",
        price: 270,
        image: "/images/products/Fire burger.png",
        category: "Fire (Acı) Serisi",
    },
    {
        id: "12",
        name: "Chicken Fire Burger",
        description: "80gr Tavuk Göğsü, 40gr Pane, Sriracha Sos, Acılı Mayonez, Soğan Turşusu, Jalapeno Biber, Iceberg.",
        price: 230,
        image: "/images/products/Chicken Fire Burger.png",
        category: "Fire (Acı) Serisi",
    },

    // E) Hot Doglar
    {
        id: "20",
        name: "Classic Hot Dog",
        description: "Özel sosis, hardal, ketçap, turşu.",
        price: 180,
        image: "/images/products/Classic hatdog.png",
        category: "Hot Doglar",
    },
    {
        id: "21",
        name: "Cheese Hot Dog",
        description: "Özel sosis, cheddar sos, karamelize soğan.",
        price: 200,
        image: "/images/products/Cheese hatdog.png",
        category: "Hot Doglar",
    },
    {
        id: "22",
        name: "Fire Hot Dog",
        description: "Özel sosis, acı sos, jalapeno, çıtır soğan.",
        price: 210,
        image: "/images/products/Fire hatdog.png",
        category: "Hot Doglar",
    },

    // F) Yan Ürünler
    {
        id: "13",
        name: "Chicken Fingers",
        description: "Çıtır tavuk parçaları, özel sos ile.",
        price: 120,
        image: "/images/products/Chicken fingers.png",
        category: "Yan Ürünler",
    },
    {
        id: "14",
        name: "Karışık Sepet",
        description: "Patates kızartması, soğan halkası, chicken fingers, mozzarella sticks.",
        price: 180,
        image: "/images/products/Karışık sepet.png",
        category: "Yan Ürünler",
    },
    {
        id: "15",
        name: "Mozzarella Sticks",
        description: "Çıtır kaplamalı mozzarella peyniri.",
        price: 130,
        image: "/images/products/Mozerella stick.png",
        category: "Yan Ürünler",
    },
    {
        id: "23",
        name: "Soğan Halkası",
        description: "8 adet çıtır soğan halkası, özel dip sos ile.",
        price: 110,
        image: "/images/products/Soganhalkasi.png",
        category: "Yan Ürünler",
    },

    // G) İçecekler
    {
        id: "16",
        name: "Coca-Cola",
        description: "330ml Kutu",
        price: 60,
        image: "/images/products/coca-cola.png",
        category: "İçecekler",
    },
    {
        id: "17",
        name: "Fanta",
        description: "330ml Kutu",
        price: 60,
        image: "/images/products/fanta.png",
        category: "İçecekler",
    },
    {
        id: "18",
        name: "Ayran",
        description: "300ml",
        price: 40,
        image: "/images/products/ayran.png",
        category: "İçecekler",
    },
    {
        id: "19",
        name: "Su",
        description: "500ml Pet Şişe",
        price: 20,
        image: "/images/products/su.png",
        category: "İçecekler",
    },
];

export const INITIAL_CATEGORIES = [
    "Klasik Burgerler",
    "Özel Seriler",
    "Tavuk Burgerler",
    "Fire (Acı) Serisi",
    "Hot Doglar",
    "Yan Ürünler",
    "İçecekler"
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
    heroSubtitle: "Dr. Burger’da her şey evinizde hazırlanmış hissi verir, ama profesyonel bir ustalığın dokunuşuyla sunulur. Ne çok yağlı ne de kuru; tam kıvamında, bol malzemeli ve doyurucu… Bizim için her burger, lezzetli bir anı yaratmak demektir. İşte bu yüzden Dr. Burger, “ev yapımı burger sevenlerin” buluşma noktasıdır.",
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
    const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
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

        // Updated keys to v7 to force refresh and fix potential corruption
        loadData("dr_burger_products_v7", setProducts);
        loadData("dr_burger_branches_v7", setBranches);
        loadData("dr_burger_content_v7", setSiteContent);
        loadData("dr_burger_applications_v7", setApplications);
        loadData("dr_burger_categories_v7", setCategories);
        setIsInitialized(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("dr_burger_products_v7", JSON.stringify(products));
            localStorage.setItem("dr_burger_branches_v7", JSON.stringify(branches));
            localStorage.setItem("dr_burger_content_v7", JSON.stringify(siteContent));
            localStorage.setItem("dr_burger_applications_v7", JSON.stringify(applications));
            localStorage.setItem("dr_burger_categories_v7", JSON.stringify(categories));
        }
    }, [products, branches, siteContent, applications, categories, isInitialized]);

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

    // Category Actions
    const addCategory = (category: string) => {
        if (!categories.includes(category)) {
            setCategories(prev => [...prev, category]);
        }
    };

    const deleteCategory = (category: string) => {
        setCategories(prev => prev.filter(c => c !== category));
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
                categories,
                addCategory,
                deleteCategory,
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
