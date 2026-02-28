"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import seedData from "../../../../convex/seed_products.json";

export default function SeedPage() {
    const seedMutation = useMutation(api.seed.seed);
    const [status, setStatus] = useState<string>("Ready to seed");
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        setStatus("Seeding...");
        try {
            // Map JSON products to the mutation arguments
            const products = seedData.products.map(p => ({
                category: p.category,
                brand: p.brand,
                name: p.name,
                gender: (p as any).gender,
                size: (p as any).size,
            }));

            const result = await seedMutation({ products });
            setStatus(`Success! Inserted: ${result.insertedCount}, Skipped: ${result.skippedCount}`);
        } catch (error: any) {
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-20 flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold italic">Seeding Tool</h1>
            <p className="text-muted-foreground">This will ingest {seedData.products.length} products.</p>
            <button
                onClick={handleSeed}
                disabled={loading}
                className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 disabled:opacity-50"
            >
                {loading ? "Processing..." : "Run Ingestion"}
            </button>
            <p className="mt-4 font-mono text-sm">{status}</p>
        </div>
    );
}
