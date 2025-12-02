"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

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
    map_url?: string;
}

export interface SiteContent {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;

    aboutText: string;
    footerDescription?: string;
    contactAddress?: string;
    contactPhone?: string;
    contactEmail?: string;
    workingHours?: string;
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
    addProduct: (product: Omit<Product, "id">) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProductsByCategory: (category: string) => Product[];

    // Branches
    branches: Branch[];
    addBranch: (branch: Omit<Branch, "id">) => Promise<void>;
    updateBranch: (id: string, branch: Partial<Branch>) => Promise<void>;
    deleteBranch: (id: string) => Promise<void>;

    // Content
    siteContent: SiteContent;
    updateSiteContent: (content: Partial<SiteContent>) => Promise<void>;

    // Applications
    applications: Application[];
    addApplication: (application: Omit<Application, "id" | "date">) => Promise<void>;
    deleteApplication: (id: string) => Promise<void>;

    // Categories
    categories: string[];
    addCategory: (category: string) => Promise<void>;
    deleteCategory: (category: string) => Promise<void>;

    isLoading: boolean;
}

// --- Initial Data (Empty defaults) ---
const DEFAULT_CONTENT: SiteContent = {
    heroTitle: "",
    heroSubtitle: "",
    aboutTitle: "",
    aboutText: ""
};

// --- Context ---

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_CONTENT);
    const [applications, setApplications] = useState<Application[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Data from Supabase
    const refreshData = async () => {
        setIsLoading(true);
        try {
            // Products
            const { data: productsData } = await supabase.from('products').select('*');
            if (productsData) setProducts(productsData);

            // Categories
            const { data: categoriesData } = await supabase.from('categories').select('name');
            if (categoriesData) setCategories(categoriesData.map(c => c.name));

            // Branches
            const { data: branchesData } = await supabase.from('branches').select('*');
            if (branchesData) setBranches(branchesData);

            // Content
            const { data: contentData } = await supabase.from('site_content').select('*').single();
            if (contentData) {
                setSiteContent({
                    heroTitle: contentData.hero_title,
                    heroSubtitle: contentData.hero_subtitle,
                    aboutTitle: contentData.about_title,
                    aboutText: contentData.about_text,
                    footerDescription: contentData.footer_description,
                    contactAddress: contentData.contact_address,
                    contactPhone: contentData.contact_phone,
                    contactEmail: contentData.contact_email,
                    workingHours: contentData.working_hours
                });
            }

            // Applications
            const { data: applicationsData } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
            if (applicationsData) setApplications(applicationsData);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Product Actions
    const addProduct = async (newProduct: Omit<Product, "id">) => {
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) console.error("Error adding product:", error);
        else refreshData();
    };

    const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
        const { error } = await supabase.from('products').update(updatedFields).eq('id', id);
        if (error) console.error("Error updating product:", error);
        else refreshData();
    };

    const deleteProduct = async (id: string) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error("Error deleting product:", error);
        else refreshData();
    };

    const getProductsByCategory = (category: string) => {
        return products.filter((p) => p.category === category);
    };

    // Branch Actions
    const addBranch = async (newBranch: Omit<Branch, "id">) => {
        const { error } = await supabase.from('branches').insert([newBranch]);
        if (error) console.error("Error adding branch:", error);
        else refreshData();
    };

    const updateBranch = async (id: string, updatedFields: Partial<Branch>) => {
        const { error } = await supabase.from('branches').update(updatedFields).eq('id', id);
        if (error) console.error("Error updating branch:", error);
        else refreshData();
    };

    const deleteBranch = async (id: string) => {
        const { error } = await supabase.from('branches').delete().eq('id', id);
        if (error) console.error("Error deleting branch:", error);
        else refreshData();
    };

    // Content Actions
    const updateSiteContent = async (content: Partial<SiteContent>) => {
        // Map camelCase to snake_case for DB
        const dbContent: any = {};
        if (content.heroTitle) dbContent.hero_title = content.heroTitle;
        if (content.heroSubtitle) dbContent.hero_subtitle = content.heroSubtitle;
        if (content.aboutTitle) dbContent.about_title = content.aboutTitle;
        if (content.aboutText) dbContent.about_text = content.aboutText;
        if (content.footerDescription) dbContent.footer_description = content.footerDescription;
        if (content.contactAddress) dbContent.contact_address = content.contactAddress;
        if (content.contactPhone) dbContent.contact_phone = content.contactPhone;
        if (content.contactEmail) dbContent.contact_email = content.contactEmail;
        if (content.workingHours) dbContent.working_hours = content.workingHours;

        const { error } = await supabase.from('site_content').update(dbContent).eq('id', 1);
        if (error) console.error("Error updating content:", error);
        else refreshData();
    };

    // Application Actions
    const addApplication = async (newApplication: Omit<Application, "id" | "date">) => {
        const { error } = await supabase.from('applications').insert([newApplication]);
        if (error) console.error("Error adding application:", error);
        else refreshData();
    };

    const deleteApplication = async (id: string) => {
        const { error } = await supabase.from('applications').delete().eq('id', id);
        if (error) console.error("Error deleting application:", error);
        else refreshData();
    };

    // Category Actions
    const addCategory = async (category: string) => {
        const { error } = await supabase.from('categories').insert([{ name: category }]);
        if (error) console.error("Error adding category:", error);
        else refreshData();
    };

    const deleteCategory = async (category: string) => {
        const { error } = await supabase.from('categories').delete().eq('name', category);
        if (error) console.error("Error deleting category:", error);
        else refreshData();
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
                isLoading
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
