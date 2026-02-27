"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const user = useQuery(api.users.viewer);
    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
            });
        }
    }, [user, reset]);

    if (user === undefined) return <div>Loading...</div>;
    if (!user) return <div>Please sign in.</div>;

    const onSubmit = async (data: ProfileValues) => {
        // TODO: Implement update mutation
        console.log(data);
        setIsEditing(false);
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8" style={{ color: "#8b1538" }}>My Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                {...register("firstName")}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#8b1538] outline-none disabled:bg-gray-50"
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                {...register("lastName")}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#8b1538] outline-none disabled:bg-gray-50"
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                        <input
                            value={user.email}
                            disabled
                            className="w-full px-4 py-2 rounded-lg border bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            {...register("phone")}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#8b1538] outline-none disabled:bg-gray-50"
                            placeholder="+254..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => { setIsEditing(false); reset(); }}
                                    className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-full bg-[#8b1538] text-white hover:bg-[#6b102b] transition-colors"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 rounded-full border border-[#8b1538] text-[#8b1538] hover:bg-[#8b1538]/5 transition-colors"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
