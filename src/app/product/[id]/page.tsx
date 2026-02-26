import { ProductImageGallery } from "@/components/product/image-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { RelatedProducts } from "@/components/product/related-products";
import { Product3DViewer } from "@/components/product/product-3d-viewer";

import { Suspense } from "react";
// In the future: import { useQuery } from "convex/react";
// In the future: import { api } from "../../../../convex/_generated/api";

// Mock Product Data fetching (Fallback until Convex is populated)
const getProduct = (id: string) => {
    return {
        id,
        name: "Golden Sands Edition",
        brand: "Desert Collection",
        price: 15000,
        description: "An evocative journey across the desert at twilight. This signature Eau de Parfum balances the warmth of amber and spiced saffron with the delicate elegance of night-blooming jasmine.",
        inStock: true,
        stockCount: 12,
        notes: ["Saffron", "Amber", "Jasmine", "Cedarwood"],
        size: "100ml / 3.4 oz",
        images: [
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
        ]
    };
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    // In the future: const product = useQuery(api.products.getById, { id: params.id });
    const product = getProduct(params.id); // Active fallback

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center pt-24 pb-32"><p>Product not found.</p></div>;
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Main Product Section layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left: Interactive Image Gallery */}
                    <div className="w-full">
                        <ProductImageGallery images={product.images} productName={product.name} />
                    </div>

                    {/* Right: Product Details and Cart Actions */}
                    <div className="w-full lg:sticky lg:top-32 lg:h-[max-content]">
                        <ProductInfo product={product} />
                    </div>

                </div>

                {/* 3D Viewer Mock */}
                <div className="mt-20">
                    <Product3DViewer />
                </div>

                {/* Space for future sections: Reviews (11.2) & Related Products (11.2) */}
                <div className="mt-20 border-t border-border pt-16">
                    {/* Reviews Section Placeholder */}
                    <h3 className="font-serif text-3xl mb-8">Customer Reviews</h3>
                    <p className="text-muted-foreground italic">No reviews yet for this product. Be the first to review!</p>
                </div>

                <RelatedProducts />

            </div>
        </div>
    );
}
