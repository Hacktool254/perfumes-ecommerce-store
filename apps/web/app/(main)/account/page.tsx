"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2, User as UserIcon, ShieldCheck, Fingerprint, Mail, Phone, AtSign, KeyRound, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const profileSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const user = useQuery(api.users.viewer);
    const updateProfile = useMutation(api.userDashboard.updateProfile);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const updateUserImage = useMutation(api.users.updateImage);
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const { register, handleSubmit, reset } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (user) {
            reset({
                fullName: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : (user.name || ""),
                phone: user.phone || "",
            });
        }
    }, [user, reset]);

    useEffect(() => {
        if (user === null) {
            router.push("/login?redirect=/account");
        }
    }, [user, router]);

    if (user === undefined) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 bg-white/5 rounded-lg w-48 mx-4" />
                <div className="h-[400px] bg-white/5 rounded-[40px] w-full" />
                <div className="h-8 bg-white/5 rounded-lg w-48 mx-4" />
                <div className="h-[300px] bg-white/5 rounded-[40px] w-full" />
            </div>
        );
    }
    
    if (user === null) return null;

    const onSubmitInfo = async (data: ProfileValues) => {
        setIsSaving(true);
        try {
            const nameParts = data.fullName.trim().split(/\s+/);
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            await updateProfile({
                firstName,
                lastName,
                phone: data.phone,
            });
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");
            const { storageId } = await result.json();
            await updateUserImage({ storageId });
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-16 pb-12">
            {/* Identity Parameters Module */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#DBC2A6] rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                            Identity Core
                        </h2>
                    </div>
                    <div className="px-4 py-2 bg-[#DBC2A6]/10 border border-[#DBC2A6]/20 rounded-xl flex items-center gap-2">
                        <Fingerprint size={12} className="text-[#DBC2A6]" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-[#DBC2A6]">Verified Member</span>
                    </div>
                </div>

                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col gap-16">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DBC2A6]/10 to-transparent" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#DBC2A6]/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                    
                    {/* Visual Identifier Section */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 pb-12 border-b border-white/5">
                        <div className="relative group/avatar">
                            <div className="w-40 h-40 bg-[#0A0D0B] rounded-[40px] flex items-center justify-center text-5xl text-[#DBC2A6] font-black overflow-hidden border border-white/10 shadow-3xl relative">
                                {isUploading ? (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-10">
                                        <Loader2 className="animate-spin w-10 h-10 text-[#DBC2A6]" />
                                    </div>
                                ) : user.image ? (
                                    <Image 
                                        src={user.image} 
                                        alt="Avatar" 
                                        fill 
                                        className="object-cover group-hover/avatar:scale-110 transition-transform duration-1000" 
                                    />
                                ) : (
                                    (user.name?.[0] || user.firstName?.[0] || "U").toUpperCase()
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#DBC2A6] rounded-2xl flex items-center justify-center text-[#0A0D0B] border-4 border-[#1A1E1C] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-2xl group-hover/avatar:shadow-[#DBC2A6]/20 group-hover/avatar:rotate-3">
                                <Camera size={20} strokeWidth={3} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Visual Signature</h3>
                                <p className="text-[#DBC2A6]/40 text-[10px] font-black uppercase tracking-[0.2em]">System-wide avatar intelligence</p>
                            </div>
                            <p className="text-white/20 text-xs font-bold leading-relaxed max-w-sm mx-auto lg:mx-0 py-2 border-l-2 border-[#DBC2A6]/10 pl-6 italic">
                                {isUploading ? "Synchronizing biometric visual data with secure cloud storage..." : "Your visual identifier is propagated across all high-fidelity system touchpoints. JPG, PNG or WEBP recommended."}
                            </p>
                        </div>
                    </div>

                    {/* Information Form */}
                    <form onSubmit={handleSubmit(onSubmitInfo)} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-white/40 ml-1">
                                <UserIcon size={12} className="text-[#DBC2A6]" /> Registry Name
                            </label>
                            <input
                                {...register("fullName")}
                                className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm shadow-inner"
                                placeholder="Alexander Pierce"
                            />
                        </div>

                        <div className="space-y-4 opacity-50 cursor-not-allowed">
                            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-white/20 ml-1">
                                <Mail size={12} className="text-white/20" /> Authentication Email
                            </label>
                            <div className="relative">
                                <input
                                    value={user.email}
                                    disabled
                                    className="w-full px-8 py-5 rounded-[24px] bg-black/40 border border-white/5 text-white/20 cursor-not-allowed font-bold text-sm"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] uppercase tracking-widest font-black bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">Immutable</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-white/40 ml-1">
                                <Phone size={12} className="text-[#DBC2A6]" /> Communication Link
                            </label>
                            <input
                                {...register("phone")}
                                className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm shadow-inner"
                                placeholder="+254 7XX XXX XXX"
                            />
                        </div>

                        <div className="md:col-span-2 pt-8 border-t border-white/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="group relative overflow-hidden px-12 py-5 rounded-[24px] bg-[#DBC2A6] text-[#0A0D0B] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-[#DBC2A6]/20"
                            >
                                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={4} />}
                                Synchronize Core Data
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Security Protocols Module */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#DBC2A6] rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                            Security Protocols
                        </h2>
                    </div>
                    <div className="px-4 py-2 bg-[#DBC2A6]/10 border border-[#DBC2A6]/20 rounded-xl flex items-center gap-2">
                        <ShieldCheck size={12} className="text-[#DBC2A6]" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-[#DBC2A6]">Fortified Link</span>
                    </div>
                </div>

                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col gap-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/[0.02] blur-[100px] -mr-32 -mt-32 rounded-full" />
                    
                    <form className="space-y-12">
                        <div className="space-y-4 max-w-md">
                            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-white/40 ml-1">
                                <KeyRound size={12} className="text-[#DBC2A6]" /> Current Access Code
                            </label>
                            <input
                                type="password"
                                className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm shadow-inner"
                                placeholder="••••••••••••"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.25em] font-black text-white/40 ml-1">New System Password</label>
                                <input
                                    type="password"
                                    className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm shadow-inner"
                                    placeholder="Generate new code"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.25em] font-black text-white/40 ml-1">Confirmation Vector</label>
                                <input
                                    type="password"
                                    className="w-full px-8 py-5 rounded-[24px] bg-[#0A0D0B] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 transition-all font-bold text-sm shadow-inner"
                                    placeholder="Repeat new code"
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <button
                                type="button"
                                className="group relative overflow-hidden px-10 py-5 rounded-[24px] border border-[#DBC2A6]/20 text-[#DBC2A6] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#DBC2A6]/5 transition-all active:scale-95 flex items-center gap-3"
                            >
                                <AtSign size={14} strokeWidth={3} className="opacity-40" />
                                Rotate Security Credentials
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Platform Trust */}
            <footer className="pt-4 flex items-center justify-center gap-8 text-[#DBC2A6]/10 text-[9px] font-black uppercase tracking-[0.4em]">
                <span>E2EE Active</span>
                <div className="w-1 h-1 rounded-full bg-white/5" />
                <span>Non-Custodial Interest Data</span>
                <div className="w-1 h-1 rounded-full bg-white/5" />
                <span>GDPR Compliant Node</span>
            </footer>
        </div>
    );
}
