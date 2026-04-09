"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { MapPin, Plus, Trash2, Edit2, X, Loader2, Check, Globe, Phone, User, Landmark, Navigation2 } from "lucide-react";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";

export default function AddressesPage() {
    const addresses = useQuery(api.addresses.list);
    const addAddress = useMutation(api.addresses.add);
    const removeAddress = useMutation(api.addresses.remove);
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        street: "",
        apartment: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Kenya",
        isDefault: false,
    });

    const handleRemove = async (id: any) => {
        if (confirm("Are you sure you want to decommission this logistics node?")) {
            await removeAddress({ id });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addAddress(formData);
            setIsAdding(false);
            setFormData({
                fullName: "",
                phone: "",
                street: "",
                apartment: "",
                city: "",
                state: "",
                postalCode: "",
                country: "Kenya",
                isDefault: false,
            });
        } catch (error) {
            console.error("Failed to add address:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (addresses === undefined) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 bg-white/5 rounded-lg w-48 mx-4" />
                <div className="h-[600px] bg-white/5 rounded-[40px] w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Module Header */}
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#DBC2A6] rounded-full" />
                    <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                        Logistics Registry
                    </h2>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-3 rounded-xl bg-[#DBC2A6]/10 border border-[#DBC2A6]/20 text-[#DBC2A6] text-[10px] font-black uppercase tracking-widest hover:bg-[#DBC2A6]/20 transition-all flex items-center gap-2"
                    >
                        <Plus size={14} strokeWidth={3} />
                        Deploy New Node
                    </button>
                )}
            </div>

            {/* Main Content Box */}
            <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DBC2A6]/10 to-transparent" />
                
                {isAdding ? (
                    <div className="p-8 md:p-16 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center justify-between mb-12">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Node Configuration</h3>
                                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-none">Establishing secure delivery coordinates</p>
                            </div>
                            <button onClick={() => setIsAdding(false)} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-1">
                                    <User size={12} className="text-[#DBC2A6]" /> Recipient Identity
                                </label>
                                <input
                                    required
                                    className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Enter full legal name"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-1">
                                    <Phone size={12} className="text-[#DBC2A6]" /> Comms Protocol
                                </label>
                                <input
                                    required
                                    className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+254 XXX XXX XXX"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-1">
                                    <Navigation2 size={12} className="text-[#DBC2A6]" /> Surface Coordinates (Street)
                                </label>
                                <input
                                    required
                                    className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm"
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    placeholder="Sector, Street, Building Identification"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-1">
                                    <Landmark size={12} className="text-[#DBC2A6]" /> Urban Hub (City)
                                </label>
                                <input
                                    required
                                    className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="City Name"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-1">
                                    <Globe size={12} className="text-[#DBC2A6]" /> Global Region
                                </label>
                                <input
                                    required
                                    className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    placeholder="Country"
                                />
                            </div>
                            
                            <div className="md:col-span-2 py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="flex items-center gap-6 cursor-pointer group/toggle" onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}>
                                    <div className={cn(
                                        "w-14 h-8 rounded-full relative transition-all duration-500 border flex items-center px-1.5",
                                        formData.isDefault ? "bg-[#DBC2A6] border-[#DBC2A6] shadow-[0_0_20px_rgba(219,194,166,0.2)]" : "bg-black/60 border-white/10"
                                    )}>
                                        <div className={cn(
                                            "w-5 h-5 rounded-full transition-transform duration-500 shadow-xl",
                                            formData.isDefault ? "translate-x-6 bg-white" : "translate-x-0 bg-white/10"
                                        )} />
                                    </div>
                                    <div className="space-y-0.5 text-left">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white group-hover/toggle:text-[#DBC2A6] transition-colors leading-none">Primary Logistics Link</p>
                                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Establish as default delivery node</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 md:flex-none px-10 py-5 rounded-[24px] border border-white/5 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white hover:border-white/20 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 md:flex-none px-12 py-5 rounded-[24px] bg-[#DBC2A6] text-[#0A0D0B] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-[#DBC2A6]/20"
                                    >
                                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={4} />}
                                        Finalize Node
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DBC2A6]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="w-24 h-24 bg-[#0A0D0B] rounded-[32px] flex items-center justify-center mb-10 border border-white/5 shadow-3xl transform group-hover:scale-110 transition-transform duration-700">
                            <MapPin className="text-white/10" size={40} strokeWidth={1} />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">Empty Registry</h3>
                        <p className="text-white/30 text-xs max-w-sm mx-auto mb-12 leading-relaxed font-bold tracking-tight">
                            Establish your delivery nodes to enable secure procurement and checkout synchronization across the platform.
                        </p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-[#DBC2A6] text-[#0A0D0B] px-12 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#DBC2A6]/20 flex items-center gap-3"
                        >
                            <Plus size={14} strokeWidth={4} />
                            Deploy Initial Node
                        </button>
                    </div>
                ) : (
                    <div className="p-10 md:p-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {addresses.map((address) => (
                                <div key={address._id} className="bg-[#0A0D0B] border border-white/5 rounded-[32px] p-10 relative overflow-hidden group hover:border-[#DBC2A6]/30 transition-all duration-700 shadow-xl flex flex-col">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2A6]/[0.02] blur-3xl -mr-16 -mt-16 group-hover:bg-[#DBC2A6]/[0.05] transition-colors duration-700" />
                                    
                                    <div className="flex justify-between items-start mb-12 relative z-10">
                                        <div className="space-y-1">
                                            {address.isDefault && (
                                                <div className="inline-flex items-center gap-2 bg-[#DBC2A6]/10 text-[#DBC2A6] px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-[#DBC2A6]/20 mb-4 scale-90 -ml-1">
                                                    Master Node
                                                </div>
                                            )}
                                            <h3 className="text-xl font-black text-white tracking-tighter uppercase truncate max-w-[180px]">{address.fullName}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-3 text-white/10 hover:text-[#DBC2A6] hover:bg-white/5 rounded-xl transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleRemove(address._id)}
                                                className="p-3 text-white/10 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4 mb-12 relative z-10 px-1 border-l border-white/5 ml-1">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-widest font-black text-white/20 leading-none mb-2">Street Access</p>
                                            <p className="text-sm text-white/60 font-bold leading-relaxed">{address.street}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-widest font-black text-white/20 leading-none mb-2">Hub Location</p>
                                            <p className="text-sm text-white/40 font-bold leading-relaxed">
                                                {address.city}{address.state ? `, ${address.state}` : ""}{address.postalCode ? ` ${address.postalCode}` : ""}
                                            </p>
                                        </div>
                                        <p className="text-[9px] text-[#DBC2A6]/40 uppercase tracking-[0.3em] font-black pt-2">{address.country}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-black text-[#DBC2A6] relative z-10 pt-6 border-t border-white/5">
                                        <div className="w-10 h-10 rounded-xl bg-[#DBC2A6]/5 border border-[#DBC2A6]/10 flex items-center justify-center scale-90">
                                            <Phone size={14} className="text-[#DBC2A6]" />
                                        </div>
                                        <span className="tracking-[0.15em] opacity-80">{address.phone}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
