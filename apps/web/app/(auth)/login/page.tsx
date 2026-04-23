import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Sign In | Ummie's Essence",
    description: "Sign in to your Ummie's Essence account.",
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black/95"><div className="w-8 h-8 border-4 border-[#8b1538] border-t-transparent rounded-full animate-spin"></div></div>}>
            <AuthForm mode="login" />
        </Suspense>
    );
}
