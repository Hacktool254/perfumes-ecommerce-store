"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useQuery(api.users.viewer);

    useEffect(() => {
        // If query hasn't loaded yet, do nothing
        if (user === undefined) return;

        // If not logged in or not an admin, and we are not on the login page...
        if ((!user || user.role !== "admin") && !pathname?.startsWith("/login")) {
            router.replace("/login");
        } else if (user && user.role === "admin" && pathname?.startsWith("/login")) {
            // If logged in as admin and on login page, redirect to dashboard
            router.replace("/");
        }
    }, [user, pathname, router]);

    // Show nothing while loading the user state to prevent flash of unauthorized content
    if (user === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-surface">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Command Center...</p>
                </div>
            </div>
        );
    }

    // Allow rendering if doing authentication flow, OR if they are a valid admin
    if (pathname?.startsWith("/login") || (user && user.role === "admin")) {
        return <>{children}</>;
    }

    return null;
}
