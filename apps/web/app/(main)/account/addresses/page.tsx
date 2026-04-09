"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { MapPin, Plus, Trash2, Edit2, X, Loader2, Check } from "lucide-react";
import { Badge } from "@workspaceRoot/packages/ui/src/badge";

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
        if (confirm("Are you sure you want to remove this address?")) {
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
            alert("Failed to add address. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (addresses === undefined) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading addresses...</div>;
    }

    return (
        <div className="max-w-4xl pb-10">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#DBC2A6] mb-3">
                        <MapPin size={14} className="opacity-50" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black">Logistics Node</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                        Shipping <span className="text-[#DBC2A6]">Registry</span>
                    </h1>
                    <p className="text-white/40 text-sm mt-3 font-medium max-w-sm leading-relaxed">
                        Manage your secure delivery coordinates and procurement addresses.
                    </p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-[#DBC2A6] text-[#0A0D0B] text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-xl shadow-[#DBC2A6]/10"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Register New Node
                    </button>
                )}
            </header>

            {isAdding && (
                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 md:p-10 mb-10 relative overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2A6]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#DBC2A6]/10 transition-colors duration-700" />
                    
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 px-2">New Coordinate Entry</h2>
                        <button onClick={() => setIsAdding(false)} className="text-white/20 hover:text-white transition-colors p-2">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Recipient Name</label>
                                <input
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Contact Link</label>
                                <input
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+254 7XX XXX XXX"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Sector / Street Address</label>
                            <input
                                required
                                className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                placeholder="House number and street name"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">City Hub</label>
                                <input
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Nairobi"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Zone / County</label>
                                <input
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    placeholder="Nairobi County"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Neural Code</label>
                                <input
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    placeholder="00100"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 pt-4 group/checkbox cursor-pointer" onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}>
                            <div className={`w-10 h-6 rounded-full relative transition-all duration-500 border flex items-center px-1 ${formData.isDefault ? "bg-[#DBC2A6] border-[#DBC2A6]" : "bg-black/40 border-white/10"}`}>
                                <div className={`w-4 h-4 rounded-full transition-transform duration-500 ${formData.isDefault ? "translate-x-4 bg-white" : "translate-x-0 bg-white/20"}`} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover/checkbox:text-white transition-colors">Establish as Primary Node</span>
                        </div>

                        <div className="flex justify-end gap-6 pt-6 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-10 py-4 rounded-2xl border border-white/10 text-white/40 text-xs font-black uppercase tracking-widest hover:text-white hover:border-white/20 transition-all"
                            >
                                Abort
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative overflow-hidden px-10 py-4 rounded-2xl bg-[#DBC2A6] text-[#0A0D0B] text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-[#DBC2A6]/10"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
                                Persist Registry
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {addresses.map((address) => (
                    <div key={address._id} className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 md:p-10 relative overflow-hidden group hover:border-[#DBC2A6]/20 transition-all duration-500 shadow-2xl">
                        {address.isDefault && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2A6]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#DBC2A6]/10 transition-colors duration-700" />
                        )}
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                {address.isDefault && (
                                    <div className="inline-flex items-center gap-2 bg-[#DBC2A6]/10 text-[#DBC2A6] px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-[#DBC2A6]/20 mb-4">
                                        Primary Node
                                    </div>
                                )}
                                <h3 className="text-xl font-black text-white tracking-tighter">{address.fullName}</h3>
                            </div>
                            <div className="flex items-center gap-2 relative z-10">
                                <button className="p-3 text-white/20 hover:text-[#DBC2A6] hover:bg-[#DBC2A6]/5 rounded-xl transition-all">
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleRemove(address._id)}
                                    className="p-3 text-white/20 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-white/40 space-y-2 mb-10 font-medium leading-relaxed">
                            <p className="text-white/60 font-black">{address.street}</p>
                            {address.apartment && <p>{address.apartment}</p>}
                            <p>{address.city}{address.state ? `, ${address.state}` : ""}{address.postalCode ? ` ${address.postalCode}` : ""}</p>
                            <p className="text-white/20 uppercase text-[10px] tracking-widest font-black pt-2">{address.country}</p>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-black text-[#DBC2A6]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#DBC2A6] opacity-40" />
                            <span className="tracking-widest">{address.phone}</span>
                        </div>
                    </div>
                ))}

                {addresses.length === 0 && !isAdding && (
                    <div className="md:col-span-2 py-24 bg-[#1A1E1C]/50 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center px-6">
                        <div className="w-20 h-20 bg-[#0A0D0B] rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                            <MapPin size={32} className="text-white/10" />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tighter mb-3 uppercase">Empty Registry</h3>
                        <p className="text-sm text-white/30 max-w-xs mb-10 font-medium leading-relaxed">Establish your delivery nodes to enable secure procurement and checkout synchronization.</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="group relative overflow-hidden px-10 py-5 rounded-[24px] bg-[#DBC2A6] text-[#0A0D0B] text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4 shadow-2xl shadow-[#DBC2A6]/20"
                        >
                            <Plus size={20} strokeWidth={3} />
                            Deploy First Node
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
