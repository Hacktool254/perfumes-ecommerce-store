import { CategoriesClient } from "@/components/categories/categories-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fragrance Collections & Categories",
    description: "Explore our curated collections of luxury perfumes and premium cosmetics. Filter by scent profile, gender, and product type.",
};

export default function CategoriesPage() {
    return <CategoriesClient />;
}
