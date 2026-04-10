"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { ProductForm } from "@/components/admin/product-form";
import { Loader2 } from "lucide-react";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const product = useQuery(api.products.getById, { id: id as Id<"products"> });

    if (product === undefined) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-neutral-400 font-serif italic">Loading essence details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-serif text-white mb-2">Fragrance Not Found</h2>
                <p className="text-neutral-400">The product you&apos;re trying to edit doesn&apos;t exist.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <ProductForm initialData={product} />
        </div>
    );
}
