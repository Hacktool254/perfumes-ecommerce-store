import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

export function useUser() {
    const userData = useQuery(api.users.viewer);

    // userData will be undefined while loading, null if unauthenticated, or the user object
    return {
        user: userData ?? null,
        isLoading: userData === undefined,
        isAuthenticated: userData !== undefined && userData !== null,
    };
}

export function useRole() {
    const { user, isLoading } = useUser();

    return {
        role: user?.role ?? null,
        isAdmin: user?.role === "admin",
        isCustomer: user?.role === "customer",
        isLoading,
    };
}
