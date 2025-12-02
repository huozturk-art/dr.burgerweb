"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
}

const SectionTitle = ({ title, subtitle, centered = true }: SectionTitleProps) => {
    return (
        <div className={`mb-12 ${centered ? "text-center" : "text-left"}`}>
            {subtitle && (
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="block text-primary font-semibold tracking-wider text-sm mb-2 uppercase"
                >
                    {subtitle}
                </motion.span>
            )}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            >
                {title}
            </motion.h2>
            <motion.div
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: "60px" }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={`h-1 bg-primary mt-4 rounded-full ${centered ? "mx-auto" : ""}`}
            />
        </div>
    );
};

export default SectionTitle;
