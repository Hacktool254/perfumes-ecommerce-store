"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black/95"><div className="w-8 h-8 border-4 border-[#8b1538] border-t-transparent rounded-full animate-spin"></div></div>}>
            <AuthForm mode="reset" />
        </Suspense>
    );
}
