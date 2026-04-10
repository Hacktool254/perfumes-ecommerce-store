"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { 
    MapPin, 
    Plus, 
    Trash2, 
    Edit2, 
    X, 
    Loader2, 
    Check, 
    Globe, 
    Phone, 
    User, 
    Landmark, 
    Navigation2,
    Zap,
    Shield,
    Sparkles,
    Hash
} from "lucide-react";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";
import { toast } from "sonner";

export default function AddressesPage() {
    const addresses = useQuery(api.addresses.list);
    const addAddress = useMutation(api.addresses.add);
    const updateAddress = useMutation(api.addresses.update);
    const removeAddress = useMutation(api.addresses.remove);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        street: "",
        apartment: "",
        city: "",
        state: "", // Labelled as County
        postalCode: "",
        country: "Kenya",
        isDefault: false,
    });

    const handleEdit = (address: any) => {
        setFormData({
            fullName: address.fullName,
            phone: address.phone,
            street: address.street,
            apartment: address.apartment || "",
            city: address.city,
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country,
            isDefault: address.isDefault,
        });
        setEditingId(address._id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
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
    };

    const handleRemove = async (id: any) => {
        toast.promise(removeAddress({ id }), {
            loading: "Decommissioning logistics node...",
            success: "Logistics node successfully purged from ledger.",
            error: "Security breach: Failed to remove node.",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (editingId) {
                await updateAddress({ id: editingId as any, ...formData });
                toast.success("Logistics manifest updated successfully.");
            } else {
                await addAddress(formData);
                toast.success("New logistics node successfully deployed.");
            }
            handleCancel();
        } catch (error) {
            toast.error("Manifest submission failed. System check required.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (addresses === undefined) {
        return (
            <div className="flex flex-col gap-12 animate-pulse">
                <div className="h-16 bg-white/[0.02] rounded-[32px] w-96" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-white/[0.02] rounded-[48px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 md:space-y-16 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* ── Page Signature ── */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-[#B07D5B1A] pb-10">
                <div className="space-y-4 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                        <div className="hidden lg:block w-1.5 h-8 bg-[#B07D5B] rounded-full shadow-[0_0_15px_#B07D5B66]" />
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight italic">Logistics Registry</h1>
                    </div>
                    <p className="text-white/30 text-base md:text-lg italic lg:pl-6 max-w-lg">Secure delivery nodes for synchronized artifact acquisition.</p>
                </div>
                
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full lg:w-auto group bg-[#B07D5B] text-[#0a0a0b] px-10 py-5 rounded-[22px] md:rounded-[24px] font-black text-[10px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_#B07D5B33] flex items-center justify-center gap-4"
                    >
                        <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                        Deploy New Node
                    </button>
                )}
            </div>

            {/* ── Add/Edit Node Form ── */}
            {isAdding && (
                <div className="bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[48px] md:rounded-[56px] p-8 md:p-14 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B07D5B03] blur-[150px] rounded-full -mr-40 -mt-40 pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-10 md:mb-14 relative z-10">
                        <div className="space-y-2">
                            <h3 className="font-display text-3xl md:text-4xl text-white tracking-tight italic">
                                {editingId ? "Manifest Update" : "Node Configuration"}
                            </h3>
                            <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 italic">
                                {editingId ? "Recalibrating coordinates" : "Establishing coordinates"}
                            </p>
                        </div>
                        <button onClick={handleCancel} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all shadow-xl">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {[
                                { label: "Recipient Identity", key: "fullName", icon: User, placeholder: "Legal Signature" },
                                { label: "Comms Protocol", key: "phone", icon: Phone, placeholder: "+254 ..." },
                                { label: "Surface Coordinates", key: "street", icon: Navigation2, placeholder: "Building / Sector", wide: true },
                                { label: "Urban Hub (City)", key: "city", icon: Landmark, placeholder: "City Center" },
                                { label: "County (Region)", key: "state", icon: MapPin, placeholder: "Nairobi / Mombasa etc." },
                                { label: "Postal Manifest (Zip)", key: "postalCode", icon: Hash, placeholder: "00100" },
                                { label: "Global Region", key: "country", icon: Globe, placeholder: "Country", wide: true },
                            ].map((field) => (
                                <div key={field.key} className={cn("space-y-4", field.wide && "md:col-span-2 lg:col-span-1")}>
                                    <label className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-black text-white/20 ml-4 italic">
                                        <field.icon size={12} className="text-[#B07D5B]/40" /> {field.label}
                                    </label>
                                    <input
                                        required={field.key !== "postalCode"}
                                        className="w-full px-8 py-5 rounded-[22px] md:rounded-[24px] bg-white/[0.01] border border-white/5 text-sm font-bold text-white placeholder:text-white/5 focus:outline-none focus:border-[#B07D5B33] focus:bg-white/[0.03] transition-all"
                                        value={(formData as any)[field.key]}
                                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10">
                            <div className="flex items-center gap-6 cursor-pointer group/toggle w-full lg:w-auto" onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}>
                                <div className={cn(
                                    "w-16 h-9 rounded-full relative transition-all duration-700 border flex items-center px-1.5 shadow-inner shrink-0",
                                    formData.isDefault ? "bg-[#B07D5B] border-[#B07D5B] shadow-[0_0_20px_#B07D5B33]" : "bg-black/60 border-white/10"
                                )}>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full transition-all duration-500 shadow-xl",
                                        formData.isDefault ? "translate-x-7 bg-white scale-110" : "translate-x-0 bg-white/10"
                                    )} />
                                </div>
                                <div className="space-y-1 text-left">
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white group-hover/toggle:text-[#B07D5B] transition-colors leading-none">Primary Logistics Link</p>
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic leading-none">Establish as master delivery node</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full lg:w-auto bg-[#B07D5B] text-[#0a0a0b] px-16 py-6 rounded-[24px] md:rounded-[28px] font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(176,125,91,0.25)] flex items-center justify-center gap-4"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-current" />}
                                {editingId ? "Update Manifest" : "Finalize Deployment"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Nodes Registry ── */}
            {!isAdding && (
                addresses.length === 0 ? (
                    <div className="bg-[#0a0a0b] border border-white/5 rounded-[48px] md:rounded-[64px] p-12 md:p-24 text-center shadow-2xl relative overflow-hidden group/empty animate-in fade-in duration-1000 min-h-[400px] flex flex-col justify-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#B07D5B03] to-transparent opacity-0 group-hover/empty:opacity-100 transition-opacity duration-1000" />
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-white/[0.01] rounded-[36px] md:rounded-[42px] border border-white/5 flex items-center justify-center mx-auto mb-10 shadow-inner group-hover/empty:scale-110 group-hover/empty:rotate-3 transition-transform duration-700">
                            <MapPin className="text-white/10 w-8 h-8 md:w-11 md:h-11" strokeWidth={1} />
                        </div>
                        <h3 className="font-display text-3xl md:text-4xl text-white tracking-tight mb-4 uppercase italic opacity-40 leading-none">Registry Null</h3>
                        <p className="text-white/20 text-xs md:text-sm max-w-xs mx-auto mb-10 md:mb-14 leading-relaxed font-medium italic">Establish your delivery nodes to enable secure procurement and checkout synchronization.</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-[#B07D5B] text-[#0a0a0b] px-12 md:px-16 py-5 md:py-6 rounded-[22px] md:rounded-[28px] font-black text-[10px] md:text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto"
                        >
                            <Plus size={16} strokeWidth={4} />
                            Deploy Initial Node
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {addresses.map((address) => (
                            <div key={address._id} className="bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[40px] md:rounded-[48px] p-8 md:p-10 relative overflow-hidden group hover:border-[#B07D5B33] transition-all duration-700 shadow-2xl flex flex-col">
                                <div className="absolute top-0 right-0 w-44 h-44 bg-[#B07D5B02] blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-[#B07D5B05] transition-all duration-1000" />
                                
                                <div className="flex justify-between items-start mb-10 md:mb-14 relative z-10">
                                    <div className="space-y-4">
                                        {address.isDefault && (
                                            <div className="inline-flex items-center gap-2 bg-[#B07D5B1A] text-[#B07D5B] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-[#B07D5B33] shadow-lg">
                                                <Shield size={10} />
                                                Master Node
                                            </div>
                                        )}
                                        <h3 className="font-display text-2xl md:text-3xl text-white tracking-tight italic group-hover:translate-x-1 transition-transform duration-500 leading-none">{address.fullName}</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleEdit(address)}
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 hover:text-[#B07D5B] hover:bg-white/5 transition-all shadow-inner"
                                        >
                                            <Edit2 size={16} strokeWidth={1.5} />
                                        </button>
                                        <button
                                            onClick={() => handleRemove(address._id)}
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 hover:text-rose-400 hover:bg-rose-500/5 transition-all shadow-inner"
                                        >
                                            <Trash2 size={16} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6 mb-10 md:mb-12 relative z-10 pl-6 border-l border-[#B07D5B1A]">
                                    <div className="space-y-2">
                                        <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 leading-none">Access Point</p>
                                        <p className="text-sm md:text-base text-white font-medium leading-relaxed tracking-tight">{address.street}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 leading-none">Hub Coordinates</p>
                                        <p className="text-[11px] md:text-sm text-white/40 font-medium leading-relaxed italic">
                                            {address.city}{address.state ? `, ${address.state}` : ""}{address.postalCode ? ` ${address.postalCode}` : ""}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#B07D5B] animate-pulse" />
                                        <p className="text-[9px] md:text-[10px] text-white/60 uppercase tracking-[0.5em] font-black">{address.country}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 relative z-10 pt-6 md:pt-8 border-t border-white/5">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-[16px] md:rounded-[18px] bg-white/[0.02] border border-white/10 flex items-center justify-center text-[#B07D5B] group-hover:bg-[#B07D5B] group-hover:text-[#0a0a0b] transition-all duration-700 shadow-xl">
                                        <Phone size={18} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20 leading-none">Secure Comms</p>
                                        <p className="text-[11px] md:text-sm font-black text-white tracking-[0.1em]">{address.phone}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
            
            {/* Visual Artifact */}
            <div className="text-center pt-8 md:pt-12 grayscale opacity-10 hover:grayscale-0 hover:opacity-100 transition-all duration-[4s]">
                 <div className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-6 cursor-default">
                    <Sparkles className="text-[#B07D5B]" size={16} />
                    <p className="text-[9px] md:text-[10px] font-black tracking-[0.6em] md:tracking-[1em] uppercase text-white">Global Logistics Core</p>
                    <Shield className="text-[#B07D5B]" size={16} />
                 </div>
            </div>
        </div>
    );
}
