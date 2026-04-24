"use client";

import { useAuth } from "@/lib/auth-context";
import { useConvexAuth } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const AUTH_ROUTES = ["/login", "/register", "/reset-password"];

function isAuthRoute(pathname: string | null) {
  return AUTH_ROUTES.some((route) => pathname?.startsWith(route));
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { isAuthenticated, isLoading: isConvexLoading } = useConvexAuth();

  const onAuthRoute = isAuthRoute(pathname);

  useEffect(() => {
    // Wait for both Convex and our viewer to finish loading
    if (isConvexLoading || isLoading) return;

    // Authenticated but viewer not resolved yet — keep waiting
    // viewer === undefined means query in flight
    // viewer === null means loaded but no record (handled below)
    if (isAuthenticated && user === undefined) return;

    if (!isAuthenticated && !onAuthRoute) {
      // Not logged in — send to login
      router.replace("/login");
      return;
    }

    if (isAuthenticated && user && user.role !== "admin" && !onAuthRoute) {
      // Logged in but not admin — block
      router.replace("/login");
      return;
    }

    if (isAuthenticated && user && user.role === "admin" && onAuthRoute) {
      // Admin on login page — send to dashboard
      router.replace("/");
      return;
    }
  }, [
    isAuthenticated,
    isConvexLoading,
    isLoading,
    user,
    onAuthRoute,
    router,
  ]);

  // ── Determine what to show ─────────────────────────────────────

  // Still loading Convex auth state
  if (isConvexLoading) {
    return <Spinner />;
  }

  // On login/register page — always render immediately
  if (onAuthRoute) {
    return <>{children}</>;
  }

  // Not authenticated yet — show spinner while redirect fires
  if (!isAuthenticated) {
    return <Spinner />;
  }

  // Authenticated but viewer not loaded yet — wait
  if (isLoading || user === undefined) {
    return <Spinner />;
  }

  // Authenticated, viewer loaded, but not admin — show spinner while redirect fires  
  if (!user || user.role !== "admin") {
    return <Spinner />;
  }

  // ✅ Confirmed admin — render dashboard
  return <>{children}</>;
}

function Spinner() {
  return (
    <div className="fixed inset-0 bg-[#0A0D0B] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-[#DBC2A6] animate-spin" />
        <p className="text-[10px] font-bold text-[#DBC2A6]/60 uppercase tracking-[0.4em]">
          Verifying Access
        </p>
      </div>
    </div>
  );
}
