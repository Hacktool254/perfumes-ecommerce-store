"use client";

import { useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useState } from "react";

export default function SeedPage() {
    const seedMutation = useMutation(api.seed.seedFromJSON);
    const [status, setStatus] = useState<string>("Ready to seed");
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        setStatus("Seeding...");
        try {
            const result = await seedMutation();
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
