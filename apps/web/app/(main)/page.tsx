import type { Metadata } from "next";
import Script from "next/script";
import { Hero } from "@/components/home/hero";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { PopularProducts } from "@/components/home/popular-products";
import { FeaturedProductsGrid } from "@/components/home/featured-products";

export const metadata: Metadata = {
  title: "Ummie's Essence | Luxury Perfumes & Cosmetics Kenya",
  description: "Shop the finest luxury fragrances, Oud perfumes, and premium cosmetics in Kenya. Fast Nairobi delivery, M-Pesa payments accepted. Discover your signature scent.",
  openGraph: {
    title: "Ummie's Essence | Luxury Perfumes & Cosmetics Kenya",
    description: "Shop the finest luxury fragrances, Oud perfumes, and premium cosmetics in Kenya. Fast Nairobi delivery, M-Pesa payments accepted.",
    url: "https://ummieessence.store",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ummie's Essence Luxury Perfumes Kenya",
      },
    ],
  },
  alternates: {
    canonical: "https://ummieessence.store",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ummie's Essence",
  "url": "https://ummieessence.store",
  "logo": "https://ummieessence.store/favicon_192x192.png",
  "description": "Luxury perfumes and premium cosmetics in Kenya. M-Pesa payments, fast Nairobi delivery.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KE",
    "addressLocality": "Nairobi"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ummie's Essence",
  "url": "https://ummieessence.store",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://ummieessence.store/shop?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />
      <FeaturedCategories />
      <PopularProducts />
      <FeaturedProductsGrid />
    </div>
  );
}
