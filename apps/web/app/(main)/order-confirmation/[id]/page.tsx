import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Download } from "lucide-react";

export const metadata = {
    title: "Order Confirmed | Ummie's Essence",
    robots: { index: false, follow: false },
};

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
    // Mock data for the order
    const mockOrder = {
        id: params.id,
        date: new Date().toLocaleDateString("en-KE", { year: 'numeric', month: 'long', day: 'numeric' }),
        total: 27500,
        shippingAddress: "Jane Doe, Building Name, Apt 4B, Nairobi, Kenya",
        paymentMethod: "M-Pesa Express",
        email: "jane@example.com"
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-3xl">

                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Thank you for your order</h1>
                    <p className="text-lg text-muted-foreground">
                        Your payment was successful and your order is confirmed. A receipt has been sent to <span className="text-foreground font-medium">{mockOrder.email}</span>.
                    </p>
                </div>

                <div className="bg-secondary/20 border border-border rounded-xl p-8 md:p-12">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-8 mb-8 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                            <p className="text-lg font-medium font-serif">{mockOrder.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Date</p>
                            <p className="text-base font-medium">{mockOrder.date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                            <p className="text-base font-medium">KES {mockOrder.total.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="font-serif text-xl mb-4">Shipping Details</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                                {mockOrder.shippingAddress}
                            </p>
                            <div className="mt-6 flex items-center gap-3 text-sm text-accent">
                                <Package className="w-4 h-4" />
                                <span>Estimated Delivery: 2-3 Business Days</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-serif text-xl mb-4">Payment Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Method</span>
                                    <span className="font-medium">{mockOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">Completed</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Transaction ID</span>
                                    <span className="font-mono text-xs">NLX892J1KQ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/shop"
                        className="w-full sm:w-auto bg-foreground text-background px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all"
                    >
                        <span>Continue Shopping</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                        className="w-full sm:w-auto bg-transparent border border-border text-foreground px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-secondary transition-all"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download Receipt</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
