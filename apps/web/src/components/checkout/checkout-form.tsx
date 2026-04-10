"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Smartphone, CheckCircle2, Loader2, ArrowRight, X, Info, Lock, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useCart } from "@/hooks/use-cart";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

// Form Validation Schema using Zod
const checkoutSchema = z.object({
    email: z.string().email("Invalid email address"),
    marketing: z.boolean(),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    address: z.string().min(5, "Address is required"),
    apartment: z.string().optional(),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(4, "Postal code is required"),
    phone: z.string().regex(/^(?:254|\+254|0)?(7\d{8}|1\d{8})$/, "Invalid phone number"),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvc: z.string().optional(),
    nameOnCard: z.string().optional()
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
    items: any[];
    subtotal: number;
    total: number;
}

export function CheckoutForm({ items, subtotal, total }: CheckoutFormProps) {
    const router = useRouter();
    const { clearCart } = useCart();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema) as any,
        defaultValues: {
            marketing: false
        }
    });

    const email = watch("email");

    const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "waiting_for_pin" | "success" | "failed">("idle");
    const [selectedPayment, setSelectedPayment] = useState<"card" | "mpesa">("card");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentOrderId, setCurrentOrderId] = useState<Id<"orders"> | null>(null);

    const placeOrder = useMutation(api.orders.placeOrder);
    const initiateStkPush = useAction(api.payments.initiateStkPush);
    
    // Poll for order status updates (Using publicTrack so it works for guests)
    const orderRecord = useQuery(api.orders.publicTrack, 
        currentOrderId && email ? { orderId: currentOrderId, email } : "skip"
    );

    useEffect(() => {
        // If the order status changes to 'paid' while we are waiting, move to success
        if (orderRecord?.status === "paid" && paymentStatus === "waiting_for_pin") {
            setPaymentStatus("success");
            clearCart();
            // Redirect happens after a short delay to show the success state
            const timer = setTimeout(() => {
                router.push(`/order-confirmation/${orderRecord._id}`);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [orderRecord, paymentStatus, clearCart, router]);

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setPaymentStatus("processing");

            // Prepare guest items for the mutation
            const guestItemsInput = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            // Call the real Convex mutation
            const orderId = await placeOrder({
                customerEmail: data.email,
                customerName: `${data.firstName} ${data.lastName}`,
                customerPhone: data.phone,
                shippingAddress: `${data.address}, ${data.apartment ? data.apartment + ", " : ""}${data.city}, ${data.postalCode}`,
                guestItems: guestItemsInput,
            });

            setCurrentOrderId(orderId);

            if (selectedPayment === "mpesa") {
                setPaymentStatus("waiting_for_pin");
                try {
                    // Trigger the real M-Pesa STK Push
                    await initiateStkPush({
                        orderId,
                        phoneNumber: data.phone
                    });
                    // The useEffect hook will handle the transition to 'success' 
                    // once the M-Pesa callback verifies the payment.
                } catch (paymentError: any) {
                    console.error("Payment initiation failed:", paymentError);
                    setPaymentStatus("failed");
                    setErrorMessage(paymentError.message || "Failed to start M-Pesa payment. Please ensure your phone is on and unlocked.");
                }
            } else {
                // For card, we still simulate for now as the Stripe/infrastructure isn't ready
                await new Promise(resolve => setTimeout(resolve, 3000));
                setPaymentStatus("success");
                await clearCart();
                setTimeout(() => {
                    router.push(`/order-confirmation/${orderId}`);
                }, 2000);
            }

        } catch (error: any) {
            console.error(error);
            setPaymentStatus("failed");
            setErrorMessage(error.message || "Something went wrong while placing your order.");
        }
    };

    return (
        <div className="space-y-12">
            
            {/* Express Checkout section */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-[#ebe0da] flex-1" />
                    <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">Express Checkout</span>
                    <div className="h-px bg-[#ebe0da] flex-1" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center h-14 bg-[#ffc439] hover:bg-[#ffb900] rounded-lg transition-colors group">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
                    </button>
                    <button className="flex items-center justify-center h-14 bg-[#1c2e36] hover:bg-black rounded-lg transition-colors group">
                        <div className="flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-white" />
                            <span className="text-white font-bold text-sm tracking-widest">M-PESA</span>
                        </div>
                    </button>
                </div>
            </section>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                
                {/* Contact section */}
                <section>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="font-serif text-xl md:text-2xl text-[#1c2e36]">Contact</h2>
                        <Link href="/login" className="text-sm text-[#1c2e36] font-medium underline underline-offset-4 hover:text-[#AA8C77] transition-colors">Log in</Link>
                    </div>
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Email"
                                className={`w-full px-4 py-4 rounded-lg bg-white border outline-none transition-all placeholder:text-gray-400 text-sm ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-[#ebe0da] focus:border-[#1c2e36]"}`}
                            />
                            {errors.email && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.email.message}</p>}
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input {...register("marketing")} type="checkbox" className="peer w-4 h-4 rounded border-[#ebe0da] text-[#1c2e36] focus:ring-0 appearance-none bg-white border transition-colors checked:bg-black checked:border-black" />
                                <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span className="text-sm text-gray-500 font-medium group-hover:text-black transition-colors">Email me with news and offers</span>
                        </label>
                    </div>
                </section>

                {/* Delivery section */}
                <section>
                    <h2 className="font-serif text-xl md:text-2xl text-[#1c2e36] mb-5">Delivery</h2>
                    <div className="space-y-4">
                        {/* Country */}
                        <div className="relative">
                            <select className="w-full px-4 py-4 rounded-lg bg-white border border-[#ebe0da] outline-none transition-all text-sm appearance-none">
                                <option>Kenya</option>
                            </select>
                            <label className="absolute left-4 -top-2.5 px-2 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest">Country/Region</label>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        {/* Name Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input {...register("firstName")} placeholder="First name" className={`w-full px-4 py-4 rounded-lg bg-white border outline-none transition-all placeholder:text-gray-400 text-sm ${errors.firstName ? "border-red-500" : "border-[#ebe0da] focus:border-[#1c2e36]"}`} />
                                {errors.firstName && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <input {...register("lastName")} placeholder="Last name" className={`w-full px-4 py-4 rounded-lg bg-white border outline-none transition-all placeholder:text-gray-400 text-sm ${errors.lastName ? "border-red-500" : "border-[#ebe0da] focus:border-[#1c2e36]"}`} />
                                {errors.lastName && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="relative">
                            <input {...register("address")} placeholder="Address" className={`w-full px-4 py-4 rounded-lg bg-white border outline-none transition-all placeholder:text-gray-400 text-sm ${errors.address ? "border-red-500" : "border-[#ebe0da] focus:border-[#1c2e36]"}`} />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            {errors.address && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.address.message}</p>}
                        </div>

                        {/* Apartment */}
                        <input {...register("apartment")} placeholder="Apartment, suite, etc. (optional)" className="w-full px-4 py-4 rounded-lg bg-white border border-[#ebe0da] focus:border-[#1c2e36] outline-none transition-all placeholder:text-gray-400 text-sm" />

                        {/* City / Postal */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input {...register("city")} placeholder="City" className={`w-full px-4 py-4 rounded-lg bg-white border outline-none transition-all placeholder:text-gray-400 text-sm ${errors.city ? "border-red-500" : "border-[#ebe0da] focus:border-[#1c2e36]"}`} />
                                {errors.city && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.city.message}</p>}
                            </div>
                            <div>
                                <input {...register("postalCode")} placeholder="Postal code" className={`w-full px-4 py-4 rounded-lg bg-white border outline-none transition-all placeholder:text-gray-400 text-sm ${errors.postalCode ? "border-red-500" : "border-[#ebe0da] focus:border-[#1c2e36]"}`} />
                                {errors.postalCode && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.postalCode.message}</p>}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <input {...register("phone")} placeholder="Phone" className={`w-full px-4 py-4 rounded-lg bg-white border outline-none transition-all placeholder:text-gray-400 text-sm ${errors.phone ? "border-red-500" : "border-[#ebe0da] focus:border-[#1c2e36]"}`} />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 group">
                                <Info className="w-4 h-4 text-gray-300 cursor-help" />
                            </div>
                            {errors.phone && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.phone.message}</p>}
                        </div>
                    </div>
                </section>

                {/* Shipping method */}
                <section>
                    <h2 className="font-serif text-xl md:text-2xl text-[#1c2e36] mb-5">Shipping method</h2>
                    <div className="px-5 py-6 bg-[#fcf8f6] rounded-xl border border-[#ebe0da] flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Standard</span>
                        <span className="text-sm font-bold text-[#1c2e36]">Free</span>
                    </div>
                </section>

                {/* Payment section */}
                <section>
                    <div className="flex flex-col gap-1 mb-5">
                        <h2 className="font-serif text-xl md:text-2xl text-[#1c2e36]">Payment</h2>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">All transactions are secure and encrypted.</p>
                    </div>

                    <div className="rounded-xl border border-[#ebe0da] overflow-hidden bg-white shadow-sm">
                        {/* Tab Headers */}
                        <div className="grid grid-cols-2">
                            <button 
                                type="button" 
                                onClick={() => setSelectedPayment("card")}
                                className={`py-5 text-center text-sm font-bold tracking-widest border-b-2 transition-all ${selectedPayment === 'card' ? 'border-[#1c2e36] bg-gray-50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                CREDIT CARD
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setSelectedPayment("mpesa")}
                                className={`py-5 text-center text-sm font-bold tracking-widest border-b-2 transition-all ${selectedPayment === 'mpesa' ? 'border-[#1c2e36] bg-gray-50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                M-PESA
                            </button>
                        </div>

                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                {selectedPayment === "card" ? (
                                    <motion.div
                                        key="card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative">
                                            <input {...register("cardNumber")} placeholder="Card number" className={`w-full px-4 py-4 rounded-lg bg-white border border-[#ebe0da] focus:border-[#1c2e36] outline-none transition-all placeholder:text-gray-400 text-sm`} />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-gray-300" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input {...register("expiry")} placeholder="Expiration date (MM/YY)" className="w-full px-4 py-4 rounded-lg bg-white border border-[#ebe0da] focus:border-[#1c2e36] outline-none transition-all placeholder:text-gray-400 text-sm" />
                                            <div className="relative">
                                                <input {...register("cvc")} placeholder="Security code" className="w-full px-4 py-4 rounded-lg bg-white border border-[#ebe0da] focus:border-[#1c2e36] outline-none transition-all placeholder:text-gray-400 text-sm" />
                                                <Info className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            </div>
                                        </div>
                                        <input {...register("nameOnCard")} placeholder="Name on card" className="w-full px-4 py-4 rounded-lg bg-white border border-[#ebe0da] focus:border-[#1c2e36] outline-none transition-all placeholder:text-gray-400 text-sm" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="mpesa"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6 text-center"
                                    >
                                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Smartphone className="w-8 h-8 text-green-600" />
                                        </div>
                                        <div className="max-w-xs mx-auto">
                                            <h3 className="font-serif text-lg text-[#1c2e36] mb-2">M-Pesa Express</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                You will receive a prompt on <span className="font-bold text-black">{register('phone').name}</span> to enter your M-Pesa PIN once you click "Pay now".
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={paymentStatus === "processing"}
                    className="w-full bg-[#1c2e36] text-white py-6 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {paymentStatus === "processing" ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <span>Pay now</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <p className="text-[11px] text-center text-gray-400 font-medium uppercase tracking-[0.2em]">
                    Ummie's Essence Secure Checkout
                </p>

            </form>

            <AnimatePresence>
                {paymentStatus === "waiting_for_pin" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl border border-[#AA8C77]/20"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                <Smartphone className="w-10 h-10 text-green-600" />
                                <div className="absolute inset-0 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                            </div>
                            <h3 className="font-serif text-3xl text-[#1c2e36] mb-3">Check Your Phone</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                We've sent a secure payment prompt to <span className="font-bold text-black font-mono">{(register('phone').name)}</span>. 
                                Please enter your M-Pesa PIN to complete the purchase.
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-center gap-3 py-3 px-4 bg-gray-50 rounded-xl text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Waiting for confirmation...
                                </div>
                                <button 
                                    onClick={() => setPaymentStatus("idle")}
                                    className="text-xs text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest transition-colors"
                                >
                                    Cancel and try again
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {paymentStatus === "success" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="font-serif text-3xl text-[#1c2e36] mb-3">Order Placed!</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Thank you for your purchase. We've sent a confirmation email to your inbox.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-[#AA8C77] text-sm font-bold uppercase tracking-widest">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Redirecting...
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
