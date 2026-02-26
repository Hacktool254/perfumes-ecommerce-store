import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
    title: "Secure Checkout | Ummie's Essence",
};

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border pb-6">
                    <div>
                        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Cart
                        </Link>
                        <h1 className="font-serif text-3xl md:text-4xl text-foreground">Checkout</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-4 py-2 rounded-full w-max">
                        <Lock className="w-4 h-4" />
                        256-bit Secure Connection
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left: Checkout Form */}
                    <div className="flex-1">
                        <CheckoutForm />
                    </div>

                    {/* Right: Order Summary (Static for mock purposes) */}
                    <div className="w-full lg:w-[380px]">
                        <div className="bg-secondary/20 rounded-lg p-6 lg:p-8 border border-border sticky top-32">
                            <h2 className="font-serif text-xl text-foreground mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {/* Mock item */}
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-20 bg-secondary/50 rounded-sm overflow-hidden flex-shrink-0 relative">
                                            <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=200&auto=format&fit=crop" alt="Perfume" className="object-cover w-full h-full" />
                                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">1</div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Golden Sands Edition</p>
                                            <p className="text-xs text-muted-foreground">100ml / 3.4 oz</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">KES 15,000</p>
                                </div>

                                {/* Mock item 2 */}
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-20 bg-secondary/50 rounded-sm overflow-hidden flex-shrink-0 relative">
                                            <img src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=200&auto=format&fit=crop" alt="Perfume" className="object-cover w-full h-full" />
                                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">1</div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Citrus Bloom</p>
                                            <p className="text-xs text-muted-foreground">50ml / 1.7 oz</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">KES 12,500</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-foreground mb-6 border-t border-border pt-6">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">KES 27,500</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-medium">Complimentary</span>
                                </div>
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount (WELCOME10)</span>
                                    <span className="font-medium">- KES 0</span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-base font-medium text-foreground">Total</span>
                                    <span className="text-2xl font-serif text-foreground">KES 27,500</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
