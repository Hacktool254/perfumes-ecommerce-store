import { Hero } from "@/components/home/hero";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { PopularProducts } from "@/components/home/popular-products";
import { FeaturedProductsGrid } from "@/components/home/featured-products";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedCategories />
      <PopularProducts />
      <FeaturedProductsGrid />
    </div>
  );
}
