"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export function ContactClient() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSent(true);
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-background pt-32 pb-32">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header Section */}
                <div className="mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-primary uppercase tracking-widest text-xs font-bold mb-4 block"
                    >
                        Get in Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl text-foreground mb-6"
                    >
                        We&apos;d Love to <br /><span className="italic font-light">Hear From You</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-xl"
                    >
                        Whether you need a fragrance recommendation or have a question about your order, our curators are here to assist.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-secondary/10 border border-border/50 p-8 md:p-12 rounded-sm backdrop-blur-sm relative"
                    >
                        {sent ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h2 className="font-serif text-3xl mb-4">Message Received</h2>
                                <p className="text-muted-foreground">Thank you for reaching out. A fragrance specialist will respond to your essence shortly.</p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="mt-8 text-primary font-medium hover:underline"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Alexander Smith"
                                            className="w-full bg-transparent border-b border-border py-3 focus:border-primary outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Email</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="alex@example.com"
                                            className="w-full bg-transparent border-b border-border py-3 focus:border-primary outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Reason for Inquiry</label>
                                    <select className="w-full bg-transparent border-b border-border py-3 focus:border-primary outline-none transition-colors appearance-none cursor-pointer">
                                        <option className="bg-background">Fragrance Recommendation</option>
                                        <option className="bg-background">Order Inquiry</option>
                                        <option className="bg-background">Collaboration</option>
                                        <option className="bg-background">General Outreach</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="How can we help you discover your essence?"
                                        className="w-full bg-transparent border-b border-border py-3 focus:border-primary outline-none transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-foreground text-background py-5 rounded-full font-medium hover:bg-foreground/90 transition-all flex items-center justify-center gap-3 group"
                                >
                                    {isSubmitting ? "Sending..." : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Right: Info & Contact Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col gap-16"
                    >
                        {/* Contact List */}
                        <div className="space-y-10">
                            {[
                                {
                                    icon: <Mail className="w-6 h-6" />,
                                    title: "Email Us",
                                    value: "support@ummieessence.store",
                                    link: "mailto:support@ummieessence.store"
                                },
                                {
                                    icon: <Phone className="w-6 h-6" />,
                                    title: "Call/WhatsApp",
                                    value: "+254 700 000 000",
                                    link: "https://wa.me/254700000000"
                                },
                                {
                                    icon: <MapPin className="w-6 h-6" />,
                                    title: "Studio Location",
                                    value: "Westlands, Nairobi, Kenya",
                                    link: "#"
                                }
                            ].map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.link}
                                    className="flex items-start gap-6 group hover:translate-x-2 transition-transform"
                                >
                                    <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-1">{item.title}</h4>
                                        <p className="text-xl text-foreground font-medium">{item.value}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="pt-10 border-t border-border">
                            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-6">Connect With Us</h4>
                            <div className="flex gap-4">
                                {[
                                    { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
                                    { icon: <MessageSquare className="w-5 h-5" />, label: "WhatsApp" },
                                ].map((social, idx) => (
                                    <button
                                        key={idx}
                                        className="h-14 flex-1 border border-border rounded-full flex items-center justify-center gap-3 hover:bg-foreground hover:text-background transition-all"
                                    >
                                        {social.icon}
                                        <span className="font-medium">{social.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aesthetic Divider/Empty space replaced with an image if needed */}
                        <div className="mt-auto hidden lg:block italic text-muted-foreground border-l-2 border-primary/20 pl-6 py-2">
                            &quot;A fragrance is the most intense form of memory.&quot; — Jean Paul Gaultier
                        </div>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}
