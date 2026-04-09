"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2, User as UserIcon } from "lucide-react";
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

    if (user === undefined) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
    if (user === null) return <div className="p-8 text-center text-muted-foreground animate-pulse">Redirecting to login...</div>;

    const onSubmitInfo = async (data: ProfileValues) => {
        setIsSaving(true);
        try {
            // Split name into first and last
            const nameParts = data.fullName.trim().split(/\s+/);
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            await updateProfile({
                firstName,
                lastName,
                phone: data.phone,
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Get upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");

            const { storageId } = await result.json();

            // 3. Update user record
            await updateUserImage({ storageId });
            
            alert("Profile picture updated!");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl pb-10">
            <header className="mb-8">
                <div className="flex items-center gap-2 text-[#DBC2A6] mb-3">
                    <UserIcon size={14} className="opacity-50" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black">Identity Hub</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                    Profile <span className="text-[#DBC2A6]">Settings</span>
                </h1>
                <p className="text-white/40 text-sm mt-3 font-medium max-w-sm leading-relaxed">
                    Manage your personal credentials and secure access parameters.
                </p>
            </header>

            <div className="space-y-8">
                {/* 1. Profile Picture Card */}
                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 md:p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2A6]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#DBC2A6]/10 transition-colors duration-700" />
                    
                    <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 mb-8 px-2">Visual Identifier</h2>

                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="w-32 h-32 bg-[#0A0D0B] rounded-3xl flex items-center justify-center text-4xl text-[#DBC2A6] font-black overflow-hidden border border-white/10 shadow-2xl relative group/avatar">
                                {isUploading ? (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                                        <Loader2 className="animate-spin w-8 h-8 text-[#DBC2A6]" />
                                    </div>
                                ) : user.image ? (
                                    <Image 
                                        src={user.image} 
                                        alt="Avatar" 
                                        fill 
                                        className="object-cover group-hover/avatar:scale-110 transition-transform duration-700" 
                                    />
                                ) : (
                                    (user.name?.[0] || user.firstName?.[0] || "U").toUpperCase()
                                )}
                            </div>
                            <label className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#DBC2A6] rounded-2xl flex items-center justify-center text-[#0A0D0B] border-4 border-[#1A1E1C] hover:scale-110 transition-all cursor-pointer shadow-xl">
                                <Camera size={18} strokeWidth={3} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-bold text-lg mb-2">Avatar Intelligence</h3>
                            <p className="text-white/30 text-sm font-medium leading-relaxed max-w-xs mx-auto md:mx-0">
                                {isUploading ? "Synchronizing visual data with secure storage..." : "Your visual signature is used across all system touchpoints. JPG, PNG or GIF recommended."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Account Information Card */}
                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 md:p-10 relative overflow-hidden group">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 mb-8 px-2">Core Parameters</h2>

                    <form onSubmit={handleSubmit(onSubmitInfo)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Legal Full Name</label>
                                <input
                                    {...register("fullName")}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                    placeholder="e.g. Alexander Pierce"
                                />
                            </div>

                            <div className="space-y-3 opacity-60">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Authentication Email</label>
                                <div className="relative">
                                    <input
                                        value={user.email}
                                        disabled
                                        className="w-full px-6 py-4 rounded-2xl bg-black/20 border border-white/5 text-white/40 cursor-not-allowed font-bold text-sm"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] uppercase tracking-tighter font-black bg-white/5 px-2 py-1 rounded-md">Locked</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Comm-Link Number</label>
                                <input
                                    {...register("phone")}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                    placeholder="+254 7XX XXX XXX"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="group relative overflow-hidden px-10 py-4 rounded-2xl bg-[#DBC2A6] text-[#0A0D0B] text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-[#DBC2A6]/10"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#0A0D0B] group-hover:scale-150 transition-transform" />}
                                Update Core Data
                            </button>
                        </div>
                    </form>
                </div>

                {/* 3. Change Password Card */}
                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 md:p-10 relative overflow-hidden group">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 mb-8 px-2">Access Security</h2>

                    <form className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Existing Access Code</label>
                            <input
                                type="password"
                                className="w-full max-w-md px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                placeholder="••••••••••••"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">New Terminal Password</label>
                                <input
                                    type="password"
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                    placeholder="Enter new code"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Confirm New Code</label>
                                <input
                                    type="password"
                                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-white/10 focus:outline-none focus:border-[#DBC2A6]/30 focus:bg-white/[0.05] transition-all font-bold text-sm"
                                    placeholder="Repeat new code"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                className="group relative overflow-hidden px-10 py-4 rounded-2xl border border-[#DBC2A6]/30 text-[#DBC2A6] text-xs font-black uppercase tracking-widest hover:bg-[#DBC2A6]/5 transition-all active:scale-[0.98]"
                            >
                                Rotate Security Credentials
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
