import { ContactClient } from "@/components/contact/contact-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Our Concierge",
    description: "Get in touch with Ummie's Essence. Our fragrance curators are here to help you find your signature scent.",
};

export default function ContactPage() {
    return <ContactClient />;
}
