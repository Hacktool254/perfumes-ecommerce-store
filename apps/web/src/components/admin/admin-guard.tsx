"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
    Loader2,
    AlertTriangle as ShieldAlert
} from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = useQuery(api.users.isAdmin);
    const router = useRouter();

    const isAuthPage = pathname === "/admin/login" || pathname === "/admin/register";

    useEffect(() => {
        // Strict redirection: If we know for a fact they aren't admin, bounce them.
        if (isAdmin === false) {
            router.replace("/");
        }
    }, [isAdmin, router]);

    // Auth pages bypass the guard completely
    if (isAuthPage) {
        return <>{children}</>;
    }

    if (isAdmin === undefined) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
                </div>
                <p className="mt-6 text-neutral-400 font-serif italic tracking-widest animate-pulse">
                    Verifying Credentials...
                </p>
            </div>
        );
    }

    if (isAdmin === false) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-white mb-2 uppercase tracking-widest">Access Denied</h1>
                <p className="text-neutral-400 max-w-md mb-8">
                    You do not have the required permissions to access the Ummie&apos;s Essence administrative sanctuary.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="px-8 py-3 rounded-full bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-neutral-200 transition-colors"
                >
                    Return to Shop
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
