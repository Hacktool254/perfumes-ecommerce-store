"use client";

import { useAuth } from "@/lib/auth-context";
import { useConvexAuth } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useAuth();
    const { isAuthenticated } = useConvexAuth();
    const [isReady, setIsReady] = useState(false);
    // Track if we just completed a sign-in to give extra time for viewer to load
    const justSignedIn = useRef(false);

    useEffect(() => {
        // If the auth context is still loading, wait
        if (isLoading) {
            justSignedIn.current = false;
            return;
        }

        const isAuthRoute = pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/reset-password");

        // If the user is authenticated at the Convex level but we don't have the
        // viewer data yet, keep waiting — don't redirect. This prevents the race
        // condition where signIn succeeds but the viewer query hasn't resolved.
        if (isAuthenticated && !user) {
            return;
        }

        // If not logged in or not an admin, and we are not on an auth page...
        if ((!user || user.role !== "admin") && !isAuthRoute) {
            router.replace("/login");
        } else if (user && user.role === "admin" && isAuthRoute) {
            // If logged in as admin and on an auth page, redirect to dashboard
            router.replace("/");
        }

        setIsReady(true);
    }, [user, isLoading, isAuthenticated, pathname, router]);

    // Show the loading spinner while:
    // 1. Auth context is loading
    // 2. Component hasn't decided what to render yet
    // 3. User is authenticated but viewer data hasn't arrived yet
    if (isLoading || !isReady || (isAuthenticated && !user)) {
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
