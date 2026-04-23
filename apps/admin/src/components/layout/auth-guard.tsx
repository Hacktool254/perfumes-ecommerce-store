"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useAuth();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait for auth to initialize
        if (isLoading) return;

        const isAuthRoute = pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/reset-password");

        // If not logged in or not an admin, and we are not on an auth page...
        if ((!user || user.role !== "admin") && !isAuthRoute) {
            router.replace("/login");
        } else if (user && user.role === "admin" && isAuthRoute) {
            // If logged in as admin and on an auth page, redirect to dashboard
            router.replace("/");
        }

        setIsReady(true);
    }, [user, isLoading, pathname, router]);

    // Show nothing while loading the user state to prevent flash of unauthorized content
    if (isLoading || !isReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-surface">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Command Center...</p>
                </div>
            </div>
        );
    }

    const isAuthRoute = pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/reset-password");

    // Allow rendering if doing authentication flow, OR if they are a valid admin
    if (isAuthRoute || (user && user.role === "admin")) {
        return <>{children}</>;
    }

    return null;
}
