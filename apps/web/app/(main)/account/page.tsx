"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera } from "lucide-react";

const profileSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const user = useQuery(api.users.viewer);

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

    if (user === undefined) return <div>Loading...</div>;
    if (!user) return <div>Please sign in.</div>;

    const onSubmitInfo = async (data: ProfileValues) => {
        // TODO: Implement update mutation
        console.log("Saving Account Info:", data);
    };

    return (
        <div className="max-w-4xl pb-10">
            <h1 className="text-[28px] font-bold text-foreground leading-tight">Profile</h1>
            <p className="text-muted-foreground text-sm mb-6">Manage your account settings</p>

            <div className="space-y-6">
                {/* 1. Profile Picture Card */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-card-foreground">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        Profile Picture
                    </h2>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-3xl text-muted-foreground font-medium">
                                {(user.name?.[0] || user.firstName?.[0] || "U").toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground border-2 border-background hover:bg-primary/90 transition-colors">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div className="text-sm text-muted-foreground max-w-sm">
                            Click the camera icon or avatar to upload a new profile picture.
                            Supported formats: JPG, PNG, GIF. Max size: 5MB.
                        </div>
                    </div>
                </div>

                {/* 2. Account Information Card */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-6 text-card-foreground">Account Information</h2>

                    <form onSubmit={handleSubmit(onSubmitInfo)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-card-foreground mb-2">Full Name</label>
                                <input
                                    {...register("fullName")}
                                    className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors text-sm"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-card-foreground mb-2">Email</label>
                                <input
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-2.5 rounded-md border border-border bg-muted text-muted-foreground cursor-not-allowed text-sm"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5 flex justify-end">Email cannot be changed</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-card-foreground mb-2">Phone Number</label>
                                <input
                                    {...register("phone")}
                                    className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors text-sm"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* 3. Change Password Card */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-card-foreground">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Change Password
                    </h2>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-card-foreground mb-2">Current Password</label>
                            <input
                                type="password"
                                className="w-full max-w-md md:max-w-none px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors text-sm"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-card-foreground mb-2">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors text-sm"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-card-foreground mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors text-sm"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        {/* Note: The screenshot cuts off here, but presumably there's a button, though I will omit it if it's strictly matching the visible area, or add a standard one. I'll omit the save button for password to exactly match what's visible, or add it just below the fold. Let's add it for functional completeness matching the style. */}
                        <div>
                            <button
                                type="button"
                                className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
