"use client";

import { useAuth } from "@/lib/auth-context";
import { useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useState, useEffect } from "react";
import { 
    User, 
    Shield, 
    Fingerprint, 
    Key, 
    Loader2,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    Zap
} from "lucide-react";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user } = useAuth();
    const updateProfile = useMutation(api.users.updateProfile);
    const updateSecurity = useMutation(api.users.updateSecurity);

    const [isLoading, setIsLoading] = useState(false);
    const [isSecurityLoading, setIsSecurityLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: "",
        newPassword: "",
    });

    // Synchronize form state with authentication node
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        toast.promise(updateProfile(profileData), {
            loading: "Synchronizing identity parameters...",
            success: "Identity matrix successfully updated.",
            error: "Synchronization failure. Please verify data integrity.",
            finally: () => setIsLoading(false)
        });
    };

    const handleSecurityUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSecurityLoading(true);
        toast.promise(updateSecurity(securityData), {
            loading: "Updating security protocols...",
            success: () => {
                setSecurityData({ currentPassword: "", newPassword: "" });
                return "Security signatures updated and encrypted.";
            },
            error: "Authentication override failed. Invalid credentials.",
            finally: () => setIsSecurityLoading(false)
        });
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* ── Page Signature ── */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#B07D5B1A] pb-10">
                <div className="space-y-4 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="hidden lg:block w-1.5 h-8 bg-[#B07D5B] rounded-full shadow-[0_0_15px_#B07D5B66]" />
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight italic">Identity Matrix</h1>
                    </div>
                    <p className="text-white/30 text-base md:text-lg italic lg:max-w-md mx-auto lg:mx-0">Refine your patron profile and secure your intellectual access within the vault.</p>
                </div>
                <div className="flex items-center justify-center gap-4 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-[24px] self-center lg:self-auto">
                    <Fingerprint className="text-[#B07D5B] opacity-40" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 leading-none">L-2 Security Clearance</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 md:gap-16">
                {/* ── Core Identity Form ── */}
                <section className="group">
                    <div className="flex items-center gap-4 mb-8 md:mb-10 px-4">
                        <User className="text-[#B07D5B] opacity-60 group-hover:scale-110 transition-transform" size={20} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">Base Parameters</h2>
                    </div>
                    
                    <form onSubmit={handleProfileUpdate} className="bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[48px] md:rounded-[56px] p-8 md:p-14 space-y-10 md:space-y-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B07D5B03] blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                            {[
                                { label: "Given Name", key: "firstName", placeholder: "e.g. Alexander" },
                                { label: "Family Signature", key: "lastName", placeholder: "e.g. Sterling" },
                                { label: "Neural Link (Email)", key: "email", value: user.email, disabled: true },
                                { label: "Mobile Node", key: "phone", placeholder: "+254 ..." },
                            ].map((field) => (
                                <div key={field.key} className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 pl-4 block">{field.label}</label>
                                    <div className="relative group/input">
                                        <input
                                            type="text"
                                            value={(field as any).value ?? (profileData as any)[field.key]}
                                            onChange={(e) => !field.disabled && setProfileData({ ...profileData, [field.key]: e.target.value })}
                                            disabled={field.disabled}
                                            placeholder={field.placeholder}
                                            className={cn(
                                                "w-full bg-white/[0.01] border border-white/5 rounded-[22px] md:rounded-[24px] px-8 py-5 text-sm font-bold text-white transition-all outline-none",
                                                field.disabled ? "opacity-30 cursor-not-allowed bg-transparent border-transparent italic" : "focus:border-[#B07D5B33] focus:bg-white/[0.03] placeholder:text-white/5"
                                            )}
                                        />
                                        {!field.disabled && (
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                                                <Sparkles size={14} className="text-[#B07D5B]" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full lg:w-auto bg-[#B07D5B] text-[#0a0a0b] px-14 py-6 rounded-[22px] md:rounded-[28px] font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_#B07D5B33] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} className="fill-current" />}
                                Synchronize Parameters
                            </button>
                        </div>
                    </form>
                </section>

                {/* ── Security Protocols ── */}
                <section className="group">
                    <div className="flex items-center gap-4 mb-8 md:mb-10 px-4">
                        <Shield className="text-[#B07D5B] opacity-60 group-hover:scale-110 transition-transform" size={20} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">Vault Overrides</h2>
                    </div>

                    <form onSubmit={handleSecurityUpdate} className="bg-[#0a0a0b] border border-white/5 rounded-[48px] md:rounded-[56px] p-8 md:p-14 space-y-10 md:space-y-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/[0.01] blur-[100px] rounded-full -ml-40 -mb-40 pointer-events-none" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                            {[
                                { label: "Current Auth Key", key: "currentPassword" },
                                { label: "New Encryption Signature", key: "newPassword" },
                            ].map((field) => (
                                <div key={field.key} className="space-y-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 pl-4 block">{field.label}</label>
                                    <div className="relative group/input">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={(securityData as any)[field.key]}
                                            onChange={(e) => setSecurityData({ ...securityData, [field.key]: e.target.value })}
                                            className="w-full bg-white/[0.01] border border-white/5 rounded-[22px] md:rounded-[24px] px-8 py-5 text-sm font-bold text-white transition-all outline-none focus:border-rose-500/20 focus:bg-white/[0.03]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 hover:text-white/40 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-4 text-white/20 px-4 py-2 bg-white/[0.01] rounded-full border border-white/5 self-center lg:self-auto">
                                <Lock size={12} />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] leading-none">End-to-End Encryption Enabled</span>
                            </div>
                            <button
                                type="submit"
                                disabled={isSecurityLoading}
                                className="w-full lg:w-auto bg-white/5 hover:bg-white/10 text-white px-14 py-6 rounded-[22px] md:rounded-[28px] font-black text-[11px] uppercase tracking-[0.4em] transition-all border border-white/10 hover:border-white/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 group/btn shadow-xl"
                            >
                                {isSecurityLoading ? <Loader2 className="animate-spin" size={16} /> : <Key size={16} className="text-white/40 group-hover/btn:text-white transition-colors" />}
                                Update Access Key
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            {/* ── Visual Artifact ── */}
            <div className="pt-8 md:pt-12 text-center">
                <div className="inline-flex flex-col md:flex-row items-center gap-6 md:gap-12 opacity-10 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-[3s] cursor-default">
                    <p className="font-display text-4xl italic text-[#B07D5B]">Ummies Essence</p>
                    <div className="hidden md:block w-px h-12 bg-[#B07D5B]/20" />
                    <p className="text-[9px] md:text-[10px] font-black tracking-[0.6em] md:tracking-[1em] uppercase text-white/40">Privileged Access Only</p>
                </div>
            </div>
        </div>
    );
}
