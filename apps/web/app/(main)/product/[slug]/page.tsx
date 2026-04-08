import { Metadata, ResolvingMetadata } from "next";
import Script from "next/script";
import { ProductImageGallery } from "@/components/product/image-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { RelatedProducts } from "@/components/product/related-products";
import { Product3DViewer } from "@/components/product/product-3d-viewer";

import { Suspense } from "react";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@workspaceRoot/convex/_generated/api";
import { redirect } from "next/navigation";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await props.params;
    const product = await client.query(api.products.getBySlug, { slug: params.slug });
    
    if (!product) return { title: "Product Not Found" };

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: `${product.name} | Ummie's Essence`,
            description: product.description,
            images: product.images?.length ? [product.images[0], ...previousImages] : previousImages,
        },
    };
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    let product;
    try {
        product = await client.query(api.products.getBySlug, { slug: params.slug });
    } catch (error) {
        console.error("❌ Product fetch failed for slug:", params.slug, error);
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-32 px-4 text-center">
                <h2 className="text-3xl font-serif mb-4">Something went wrong</h2>
                <p className="text-muted-foreground mb-8">We encountered an error while retrieving this product. Please try again later.</p>
                <button 
                   onClick={() => window.location.reload()} 
                   className="btn-lattafa-primary btn-pill px-8 py-3 text-white"
                >
                   RETRY
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-32 px-4 text-center">
                <h2 className="text-3xl font-serif mb-4">Product Not Found</h2>
                <p className="text-muted-foreground">The product with slug "{params.slug}" could not be found in our collection.</p>
            </div>
        );
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.images || [],
        "description": product.description,
        "brand": {
            "@type": "Brand",
            "name": product.brand || "Lattafa"
        },
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "KES",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "url": `https://ummies-essence.vercel.app/product/${params.slug}`
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
                        <ProductImageGallery images={product.images || []} productName={product.name} />
                    </div>
                    <div className="w-full lg:sticky lg:top-32 lg:h-[max-content]">
                        {/* We map Convex stock property back to ProductInfo expectations if needed */}
                        <ProductInfo product={{...product, inStock: product.stock > 0, stockCount: product.stock} as any} />
                    </div>
                </div>

                <div className="mt-20">
                    <Product3DViewer />
                </div>

                <div className="mt-20 border-t border-border pt-16">
                    <h3 className="font-serif text-3xl mb-8">Customer Reviews</h3>
                    <p className="text-muted-foreground italic">No reviews yet for this product. Be the first to review!</p>
                </div>

                <RelatedProducts currentProductId={product._id as any} />
            </div>
        </div>
    );
}
