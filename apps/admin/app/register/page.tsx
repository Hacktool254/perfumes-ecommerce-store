import { AdminAuthForm } from "@/components/admin/admin-auth-form";
import { Suspense } from "react";

export const metadata = {
    title: "Admin Registration - Ummie's Essence",
    description: "Create an admin account for Ummie's Essence.",
};

export default function AdminRegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0D0B] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#DBC2A6] border-t-transparent rounded-full animate-spin"></div></div>}>
            <AdminAuthForm mode="register" redirectPath="/admin" />
        </Suspense>
    );
}
