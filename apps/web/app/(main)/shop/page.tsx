import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
    title: "Shop All Collections | Ummie's Essence",
    description: "Browse our signature collection of luxury perfumes, colognes, and body mists.",
};

function ShopLoading() {
    return (
        <div className="flex flex-col items-center justify-center py-32 w-full">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-serif italic text-lg">Preparing the showcase...</p>
        </div>
    );
}

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            <div className="container mx-auto px-4">
                <Suspense fallback={<ShopLoading />}>
                    <ShopHeader />

                    <div className="flex flex-col md:flex-row mt-8 gap-8">
                        <ShopFilters />

                        <main className="flex-1">
                            <ProductGrid />
                        </main>
                    </div>
                </Suspense>
            </div>
        </div>
    );
}
