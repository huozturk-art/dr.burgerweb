"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

interface TableContextType {
    tableNumber: number | null;
    branchId: string | null;
    setTable: (num: number) => void;
    setBranch: (id: string) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({ children }: { children: ReactNode }) => {
    const [tableNumber, setTableNumber] = useState<number | null>(null);
    const [branchId, setBranchId] = useState<string | null>(null);

    // Sync with URL params initially
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("t") || params.get("table");
        const b = params.get("b") || params.get("branch");

        if (t) {
            const num = parseInt(t);
            if (!isNaN(num)) {
                // Check if this is a NEW session (different table than last time)
                const savedTable = localStorage.getItem("dr_burger_table");
                const savedTableNum = savedTable ? parseInt(savedTable) : null;

                if (savedTableNum !== null && savedTableNum !== num) {
                    // Table changed → new QR scan at a different table
                    // Clear stale cart from previous session
                    localStorage.removeItem("dr_burger_cart");
                }

                setTableNumber(num);
                localStorage.setItem("dr_burger_table", t);
            }
        } else {
            const saved = localStorage.getItem("dr_burger_table");
            if (saved) setTableNumber(parseInt(saved));
        }

        if (b) {
            setBranchId(b);
            localStorage.setItem("dr_burger_branch", b);
        } else {
            const saved = localStorage.getItem("dr_burger_branch");
            if (saved) setBranchId(saved);
        }
    }, []);

    const setTable = (num: number) => {
        setTableNumber(num);
        localStorage.setItem("dr_burger_table", num.toString());
    };

    const setBranch = (id: string) => {
        setBranchId(id);
        localStorage.setItem("dr_burger_branch", id);
    };

    return (
        <TableContext.Provider value={{ tableNumber, branchId, setTable, setBranch }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTable = () => {
    const context = useContext(TableContext);
    if (context === undefined) {
        throw new Error("useTable must be used within a TableProvider");
    }
    return context;
};
