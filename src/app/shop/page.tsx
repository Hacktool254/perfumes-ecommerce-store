import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ProductGrid } from "@/components/shop/product-grid";

export const metadata = {
    title: "Shop All Collections | Ummie's Essence",
    description: "Browse our signature collection of luxury perfumes, colognes, and body mists.",
};

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            <div className="container mx-auto px-4">

                {/* Top Header/Search/Sort Bar */}
                <ShopHeader />

                <div className="flex flex-col md:flex-row mt-8 gap-8">
                    {/* Left Sidebar Filters */}
                    <ShopFilters />

                    {/* Main Product Grid Area */}
                    <main className="flex-1">
                        <ProductGrid />
                    </main>
                </div>

            </div>
        </div>
    );
}
