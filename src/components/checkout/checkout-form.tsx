"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Smartphone, CheckCircle2, Loader2, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Form Validation Schema using Zod
const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    mpesaNumber: z.string().regex(/^(?:254|\+254|0)?(7\d{8}|1\d{8})$/, "Invalid M-Pesa number (e.g. 0712345678)"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
    const router = useRouter();
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "awaiting_pin" | "success" | "failed">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            mpesaNumber: ""
        }
    });

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setPaymentStatus("awaiting_pin");
            console.log("Triggering M-Pesa STK Push to:", data.mpesaNumber);

            // Simulate network request to Convex action for STK Push
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Simulate user entering PIN on their phone
            console.log("Waiting for user callback...");
            await new Promise(resolve => setTimeout(resolve, 4000));

            // Simulate Success for now
            setPaymentStatus("success");

            // Redirect to Order Confirmation after short delay
            setTimeout(() => {
                router.push("/order-confirmation/ORD-0847293"); // Mock ID
            }, 2000);

        } catch (error) {
            console.error(error);
            setPaymentStatus("failed");
            setErrorMessage("Payment request timed out or was cancelled. Please try again.");
        }
    };

    return (
        <div className="bg-background">

            {/* Payment Status Overlay / Modal */}
            <AnimatePresence>
                {paymentStatus !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-secondary/30 border border-border rounded-xl p-8 max-w-sm w-full text-center shadow-2xl"
                        >
                            {paymentStatus === "awaiting_pin" && (
                                <>
                                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Smartphone className="w-8 h-8 text-accent animate-pulse" />
                                    </div>
                                    <h3 className="font-serif text-2xl mb-2">Check your phone</h3>
                                    <p className="text-muted-foreground text-sm mb-6">
                                        An M-Pesa prompt has been sent to your phone. Please enter your PIN to complete the transaction of KES 27,500.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-accent/80 text-sm font-medium">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Waiting for payment...
                                    </div>
                                </>
                            )}

                            {paymentStatus === "success" && (
                                <>
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="font-serif text-2xl mb-2 text-green-600 dark:text-green-400">Payment Successful</h3>
                                    <p className="text-muted-foreground text-sm">
                                        We're preparing your order. Redirecting...
                                    </p>
                                </>
                            )}

                            {paymentStatus === "failed" && (
                                <>
                                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <X className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h3 className="font-serif text-2xl mb-2 text-red-600 dark:text-red-400">Payment Failed</h3>
                                    <p className="text-muted-foreground text-sm mb-6">
                                        {errorMessage}
                                    </p>
                                    <button
                                        onClick={() => setPaymentStatus("idle")}
                                        className="w-full bg-foreground text-background py-3 rounded-full font-medium"
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                {/* Shipping Information */}
                <section>
                    <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-sans">1</span>
                        Shipping Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">First Name</label>
                            <input
                                {...register("firstName")}
                                className={`w-full bg-secondary/30 border rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent transition-colors ${errors.firstName ? "border-red-500" : "border-border"}`}
                                placeholder="Jane"
                            />
                            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Last Name</label>
                            <input
                                {...register("lastName")}
                                className={`w-full bg-secondary/30 border rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent transition-colors ${errors.lastName ? "border-red-500" : "border-border"}`}
                                placeholder="Doe"
                            />
                            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium text-foreground">Email Address</label>
                        <input
                            {...register("email")}
                            type="email"
                            className={`w-full bg-secondary/30 border rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent transition-colors ${errors.email ? "border-red-500" : "border-border"}`}
                            placeholder="jane@example.com"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium text-foreground">Delivery Address</label>
                        <input
                            {...register("address")}
                            className={`w-full bg-secondary/30 border rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent transition-colors ${errors.address ? "border-red-500" : "border-border"}`}
                            placeholder="Street name, Building name, Apt no."
                        />
                        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                    </div>

                    <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium text-foreground">City / Town</label>
                        <input
                            {...register("city")}
                            className={`w-full bg-secondary/30 border rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent transition-colors ${errors.city ? "border-red-500" : "border-border"}`}
                            placeholder="Nairobi"
                        />
                        {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                    </div>
                </section>

                {/* Payment Information */}
                <section>
                    <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-sans">2</span>
                        Payment Method
                    </h2>

                    <div className="bg-secondary/20 border-2 border-accent/50 rounded-lg p-6 relative overflow-hidden">
                        {/* M-Pesa Accent Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -mr-8 -mt-8" />

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground">M-Pesa Express</h3>
                                <p className="text-sm text-muted-foreground">Prompt will be sent to your phone</p>
                            </div>
                        </div>

                        <div className="space-y-2 relative z-10 w-full md:max-w-md">
                            <label className="text-sm font-medium text-foreground">M-Pesa Phone Number</label>
                            <input
                                {...register("mpesaNumber")}
                                className={`w-full bg-background border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors ${errors.mpesaNumber ? "border-red-500" : "border-green-500/30"}`}
                                placeholder="07XX XXX XXX or 2547XXXXXXXX"
                            />
                            {errors.mpesaNumber && <p className="text-xs text-red-500">{errors.mpesaNumber.message}</p>}
                        </div>
                    </div>

                    <div className="mt-4 p-4 rounded-md border border-border bg-secondary/10 flex items-start gap-4">
                        <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            By proceeding, you authorize Ummie's Essence to initiate an M-Pesa payment request to your provided phone number. All transactions are secure and encrypted.
                        </p>
                    </div>
                </section>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={paymentStatus === "awaiting_pin"}
                    className="w-full bg-foreground text-background py-5 rounded-full font-medium text-lg flex items-center justify-center gap-3 hover:bg-foreground/90 transition-all hover:shadow-xl"
                >
                    <span>Pay KES 27,500</span>
                    <ArrowRight className="w-5 h-5" />
                </button>

            </form>

        </div>
    );
}
