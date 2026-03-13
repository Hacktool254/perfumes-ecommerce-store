import { AboutClient } from "@/components/about/about-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Heritage & Art of Essence",
    description: "Discover the story behind Ummie's Essence. Our passion for artisanal fragrances and commitment to authentic luxury in Kenya.",
};

export default function AboutPage() {
    return <AboutClient />;
}
