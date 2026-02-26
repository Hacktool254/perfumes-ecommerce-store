import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-sidebar border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-primary mb-4 block">
                            Ummie's Essence
                        </Link>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Experience the true essence of luxury. Curated perfumes and premium cosmetics shipped countrywide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-sans font-semibold mb-4 text-foreground">Explore</h3>
                        <ul className="space-y-3">
                            <li><Link href="/shop" className="text-muted-foreground hover:text-accent transition-colors">Shop All</Link></li>
                            <li><Link href="/categories" className="text-muted-foreground hover:text-accent transition-colors">Categories</Link></li>
                            <li><Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">Our Story</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-sans font-semibold mb-4 text-foreground">Stay Connected</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe for exclusive offers, new arrivals, and VIP access.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Ummie's Essence. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
