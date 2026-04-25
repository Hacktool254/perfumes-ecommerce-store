import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ProductGrid } from "@/components/shop/product-grid";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
    title: "Shop All Perfumes & Cosmetics | Ummie's Essence",
    description: "Browse our signature collection of luxury perfumes, Oud fragrances, designer colognes, and premium cosmetics. Free delivery in Nairobi. M-Pesa accepted.",
    openGraph: {
        title: "Shop All Perfumes & Cosmetics | Ummie's Essence",
        description: "Luxury perfumes and premium cosmetics curated for Kenya. Free delivery in Nairobi.",
        url: "https://ummieessence.store/shop",
    },
    alternates: {
        canonical: "https://ummieessence.store/shop",
    },
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
            <div className="container mx-auto px-4 max-w-[1440px]">
                <Suspense fallback={<ShopLoading />}>
                    <ShopHeader />

                    <div className="mt-8 flex flex-col md:flex-row gap-12">
                        {/* Sidebar Filters */}
                        <div className="hidden md:block w-[280px] shrink-0">
                            <ShopFilters />
                        </div>

                        {/* Right Content — Product Grid (Now dynamic width) */}
                        <main className="flex-1 min-w-0">
                            <ProductGrid />
                        </main>
                    </div>
                </Suspense>
            </div>
        </div>
    );
}
