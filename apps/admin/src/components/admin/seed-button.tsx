"use client";

import { useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import seedData from "@workspaceRoot/convex/seed_products.json";

export function SeedButton() {
  const seed = useMutation(api.seed.seed);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{inserted: number, skipped: number} | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await seed({ products: seedData.products });
      setResult({ inserted: res.insertedCount, skipped: res.skippedCount });
    } catch (err) {
      console.error("Seed failed:", err);
      alert("Seed failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleSeed} disabled={loading}>
        {loading ? "Seeding..." : "Seed Products"}
      </Button>
      {result && (
        <p className="text-sm text-muted-foreground">
          Inserted: {result.inserted}, Skipped: {result.skipped}
        </p>
      )}
    </div>
  );
}
