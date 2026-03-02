import { Metadata, ResolvingMetadata } from "next";
import Script from "next/script";
import { ProductImageGallery } from "@/components/product/image-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { RelatedProducts } from "@/components/product/related-products";
import { Product3DViewer } from "@/components/product/product-3d-viewer";

import { Suspense } from "react";

// Mock Product Data fetching (Fallback until Convex is fully integrated for server-side)
const getProduct = (id: string) => {
    return {
        id,
        name: "Golden Sands Edition",
        slug: "golden-sands-edition",
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

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const product = getProduct(params.id);
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: `${product.name} | Ummie's Essence`,
            description: product.description,
            images: [product.images[0], ...previousImages],
        },
    };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = getProduct(params.id);

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center pt-24 pb-32"><p>Product not found.</p></div>;
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.images,
        "description": product.description,
        "brand": {
            "@type": "Brand",
            "name": product.brand
        },
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "KES",
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "url": `https://ummies-essence.vercel.app/product/${params.id}`
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            <Script
                id="product-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    <div className="w-full">
                        <ProductImageGallery images={product.images} productName={product.name} />
                    </div>
                    <div className="w-full lg:sticky lg:top-32 lg:h-[max-content]">
                        <ProductInfo product={product} />
                    </div>
                </div>

                <div className="mt-20">
                    <Product3DViewer />
                </div>

                <div className="mt-20 border-t border-border pt-16">
                    <h3 className="font-serif text-3xl mb-8">Customer Reviews</h3>
                    <p className="text-muted-foreground italic">No reviews yet for this product. Be the first to review!</p>
                </div>

                <RelatedProducts currentProductId={product.id as any} />
            </div>
        </div>
    );
}
