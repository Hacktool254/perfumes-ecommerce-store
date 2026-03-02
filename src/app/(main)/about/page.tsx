"use client";

export const metadata = {
    title: "Our Heritage & Art of Essence",
    description: "Discover the story behind Ummie's Essence. Our passion for artisanal fragrances and commitment to authentic luxury in Kenya.",
};

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background pt-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1615022702095-ff2c036f3360?q=80&w=2670&auto=format&fit=crop"
                        alt="Luxury Perfume Crafting"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                </motion.div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-primary-foreground/80 uppercase tracking-[0.3em] text-sm mb-6 block"
                    >
                        Our Heritage
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tighter"
                    >
                        The Art of <br /> <span className="italic font-light">Essence</span>
                    </motion.h1>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-[3/4] rounded-sm overflow-hidden"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=1000&auto=format&fit=crop"
                                alt="Ummie's Essence Founder"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col gap-8"
                        >
                            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
                                Curating Fragrances <br /> That Tell Your <span className="text-primary italic">Story</span>.
                            </h2>
                            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                                <p>
                                    Founded with a passion for the olfactory arts, Ummie's Essence began as a boutique dream in the heart of Nairobi. We believe that a fragrance is more than just a scent—it's an invisible accessory, a memory captured in a bottle, and a silent declaration of identity.
                                </p>
                                <p>
                                    Our mission is to bring the world's most exquisite and authentic perfumes to your doorstep. From the spiced warmth of artisanal Ouds to the crisp elegance of classic florals, every product in our collection is hand-selected for its quality, longevity, and soul.
                                </p>
                                <p>
                                    We don't just sell perfumes; we invite you to discover your signature essence.
                                </p>
                            </div>
                            <div className="pt-4">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 text-foreground font-medium border-b border-foreground pb-1 hover:gap-4 transition-all"
                                >
                                    Explore the Collection <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl mb-4">Our Core Pillars</h2>
                        <div className="w-12 h-[2px] bg-primary mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <ShieldCheck className="w-8 h-8" />,
                                title: "100% Authenticity",
                                desc: "We source directly from official distributors to guarantee every drop is genuine luxury."
                            },
                            {
                                icon: <Star className="w-8 h-8" />,
                                title: "Curated Excellence",
                                desc: "Our catalog isn't just large—it's curated. We only stock scents we believe in."
                            },
                            {
                                icon: <Heart className="w-8 h-8" />,
                                title: "Personal Connection",
                                desc: "Customer service that feels like a private consultation, tailored to your taste."
                            }
                        ].map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="flex flex-col items-center text-center p-8 bg-background border border-border shadow-sm hover:shadow-xl transition-shadow rounded-sm"
                            >
                                <div className="mb-6 text-primary">{value.icon}</div>
                                <h3 className="font-serif text-xl mb-4">{value.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-tight">
                            Ready to find your <br /> <span className="italic">Signature Essence?</span>
                        </h2>
                        <Link
                            href="/shop"
                            className="bg-foreground text-background px-12 py-5 rounded-full font-medium text-lg hover:bg-foreground/90 transition-all hover:shadow-2xl inline-block"
                        >
                            Shop All Collections
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
            </section>
        </main>
    );
}
