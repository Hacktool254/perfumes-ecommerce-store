"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Loader2, Package, CheckCircle2, Truck, Check } from "lucide-react";
import Image from "next/image";

export function TrackForm() {
    const [activeTab, setActiveTab] = useState<"order" | "tracking">("order");
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [hasAttemptedTrack, setHasAttemptedTrack] = useState(false);
    
    // Pass args only if attempted, to avoid premature fetching
    const trackingQueryArgs = hasAttemptedTrack && orderId.trim() !== "" && email.trim() !== ""
        ? { orderId: orderId.trim(), email: email.trim() } : "skip";
        
    const orderData = useQuery(api.orders.publicTrack, trackingQueryArgs);
    const isLoading = orderData === undefined && hasAttemptedTrack;
    
    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setHasAttemptedTrack(true);
    };

    const StatusStep = ({ 
        title, 
        completed, 
        current 
    }: { 
        title: string; 
        completed: boolean; 
        current: boolean; 
    }) => (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                completed ? "bg-[#8a2e3b] border-[#8a2e3b] text-white" :
                current ? "border-[#8a2e3b] text-[#8a2e3b] bg-white" :
                "border-gray-200 text-gray-300"
            }`}>
                {completed ? <Check className="w-4 h-4 text-white" strokeWidth={3} /> : <div className={`w-2 h-2 rounded-full ${current ? 'bg-[#8a2e3b]' : 'bg-transparent'}`} />}
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${
                completed || current ? "text-[#1c2e36]" : "text-gray-400"
            }`}>
                {title}
            </span>
        </div>
    );

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
            <h2 className="text-[22px] font-bold text-[#2f2f2f] mb-8">
                Track your order
            </h2>
            
            {/* Tabs */}
            <div className="flex w-full mb-8 border-b border-gray-200">
                <button
                    onClick={() => { setActiveTab("order"); setHasAttemptedTrack(false); }}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                        activeTab === "order" 
                        ? "text-[#8a2e3b] border-b-2 border-[#8a2e3b]" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    Order number
                </button>
                <button
                    onClick={() => { setActiveTab("tracking"); setHasAttemptedTrack(false); }}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                        activeTab === "tracking" 
                        ? "text-[#8a2e3b] border-b-2 border-[#8a2e3b]" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    Tracking number
                </button>
            </div>
            
            {/* Form */}
            {activeTab === "order" ? (
                <form onSubmit={handleTrack} className="w-full space-y-4 text-center">
                    <input
                        type="text"
                        placeholder="Order number"
                        value={orderId}
                        onChange={(e) => { setOrderId(e.target.value); setHasAttemptedTrack(false); }}
                        className="w-full px-4 py-3 bg-[#fdfdfd] border border-gray-100 placeholder:text-gray-300 rounded focus:outline-none focus:border-gray-300 transition-colors shadow-sm"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setHasAttemptedTrack(false); }}
                        className="w-full px-4 py-3 bg-[#fdfdfd] border border-gray-100 placeholder:text-gray-300 rounded focus:outline-none focus:border-gray-300 transition-colors shadow-sm"
                        required
                    />
                    
                    <button type="button" className="text-[13px] text-gray-500 hover:text-[#8a2e3b] transition-colors mt-2 mb-6 cursor-pointer">
                        Verify by <span className="text-[#8a2e3b]">phone number</span>
                    </button>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-white text-black border-2 border-black font-bold text-sm tracking-widest uppercase py-3.5 hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Track
                    </button>
                </form>
            ) : (
                <div className="w-full space-y-4 text-center">
                    <input
                        type="text"
                        placeholder="Tracking number"
                        className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded focus:outline-none focus:border-black transition-colors"
                        disabled
                    />
                    <p className="text-sm text-gray-400 mt-4">Tracking by courier number is coming soon.</p>
                </div>
            )}
            
            {/* Results */}
            {hasAttemptedTrack && !isLoading && orderData !== undefined && (
                <div className="w-full mt-12 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {orderData === null ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded text-center text-sm border border-red-100">
                            We couldn't find an order matching that information. Please check your details and try again.
                        </div>
                    ) : (
                        <div className="bg-white border flex flex-col border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-50 p-6 border-b border-gray-100">
                                <h3 className="font-serif text-xl text-[#1c2e36] mb-1">Order Details</h3>
                                <p className="text-sm text-gray-500 flex justify-between">
                                    <span>ID: {orderData._id.slice(0, 12)}...</span>
                                    <span className="font-semibold text-black uppercase">{orderData.status}</span>
                                </p>
                            </div>
                            
                            {/* Tracking Timeline */}
                            <div className="p-8 border-b border-gray-100">
                                <div className="relative flex justify-between items-center mb-2">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10" />
                                    {/* simple progress bar fill */}
                                    <div 
                                        className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#8a2e3b] -z-10 transition-all duration-1000" 
                                        style={{ 
                                            width: 
                                                orderData.status === 'pending' ? '15%' :
                                                orderData.status === 'paid' ? '50%' :
                                                orderData.status === 'shipped' ? '85%' :
                                                orderData.status === 'delivered' ? '100%' : '0%'
                                        }} 
                                    />
                                    <StatusStep title="Pending" completed={['paid', 'shipped', 'delivered'].includes(orderData.status)} current={orderData.status === 'pending'} />
                                    <StatusStep title="Paid" completed={['shipped', 'delivered'].includes(orderData.status)} current={orderData.status === 'paid'} />
                                    <StatusStep title="Shipped" completed={orderData.status === 'delivered'} current={orderData.status === 'shipped'} />
                                    <StatusStep title="Delivered" completed={orderData.status === 'delivered'} current={orderData.status === 'delivered'} />
                                </div>
                            </div>
                            
                            {/* Products summary */}
                            <div className="p-6 bg-gray-50 flex flex-col gap-4">
                                <h4 className="text-sm font-bold text-[#1c2e36] uppercase tracking-wider mb-2">Items</h4>
                                {orderData.items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-16 h-16 relative bg-white border border-gray-100 rounded-lg p-2">
                                            {item.product?.images?.[0] ? (
                                                <Image 
                                                    src={item.product.images[0]} 
                                                    alt={item.product.name} 
                                                    fill 
                                                    className="object-contain" 
                                                />
                                            ) : (
                                                <Package className="w-8 h-8 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#1c2e36]">{item.product?.name || "Unknown Product"}</span>
                                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
