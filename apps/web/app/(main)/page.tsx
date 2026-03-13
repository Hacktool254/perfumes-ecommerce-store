import { Hero } from "@/components/home/hero";
import { EditorialBanner } from "@/components/home/editorial-banner";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { ImmersiveImageBlock } from "@/components/home/immersive-image";
import { PopularProducts } from "@/components/home/popular-products";
import { FeaturedProductsGrid } from "@/components/home/featured-products";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <EditorialBanner />
      <FeaturedCategories />
      <ImmersiveImageBlock />
      <PopularProducts />
      <FeaturedProductsGrid />
    </div>
  );
}
