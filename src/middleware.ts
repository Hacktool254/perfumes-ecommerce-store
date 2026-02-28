import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isAdminMode = process.env.ADMIN_MODE === 'true';

const isClientSignInPage = createRouteMatcher(["/login", "/register"]);
const isAdminSignInPage = createRouteMatcher(["/admin/login", "/admin/register"]);

const isProtectedRoute = createRouteMatcher(["/account(.*)", "/admin(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    // If in ADMIN_MODE, force root access to /admin
    if (isAdminMode && request.nextUrl.pathname === "/") {
        return nextjsMiddlewareRedirect(request, "/admin");
    }

    const isClientAuthReq = isClientSignInPage(request);
    const isAdminAuthReq = isAdminSignInPage(request);
    const isAuthenticated = await convexAuth.isAuthenticated();

    // Block logic: Admin portal vs Client portal
    if (isAdminMode && isClientAuthReq) {
        return nextjsMiddlewareRedirect(request, "/admin/login");
    }
    if (!isAdminMode && isAdminAuthReq) {
        return nextjsMiddlewareRedirect(request, "/login");
    }

    // Handles redirection if already authenticated
    if ((isAdminMode && isAdminAuthReq) || (!isAdminMode && isClientAuthReq)) {
        if (isAuthenticated) {
            return nextjsMiddlewareRedirect(request, isAdminMode ? "/admin" : "/account");
        }
        // User is on an auth page and NOT authenticated — let them through
        return;
    }

    // Protected Route Handling (auth pages already handled above)
    if (isProtectedRoute(request) && !isAuthenticated) {
        return nextjsMiddlewareRedirect(request, isAdminMode ? "/admin/login" : "/login");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
