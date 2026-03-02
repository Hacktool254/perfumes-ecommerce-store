import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isAdminMode = process.env.ADMIN_MODE === 'true';

const isClientSignInPage = createRouteMatcher(["/login", "/register", "/reset-password"]);
const isAdminSignInPage = createRouteMatcher(["/admin/login", "/admin/register"]);
const isAdminPath = createRouteMatcher(["/admin(.*)"]);
const isAccountPath = createRouteMatcher(["/account(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    const { pathname } = request.nextUrl;
    const isAuthenticated = await convexAuth.isAuthenticated();

    // ─── ADMIN MODE ─────────────────────────────────────────────────────────
    if (isAdminMode) {
        // If they hit the client homepage/root, take them to the admin dashboard
        if (pathname === "/") {
            return nextjsMiddlewareRedirect(request, "/admin");
        }

        // If they hit client login/auth, take them to admin login
        if (isClientSignInPage(request)) {
            return nextjsMiddlewareRedirect(request, "/admin/login");
        }

        // Redirect to admin dashboard if already logged in and hitting admin auth pages
        if (isAdminSignInPage(request) && isAuthenticated) {
            return nextjsMiddlewareRedirect(request, "/admin");
        }

        // Standard protected route check for /admin/
        if (isAdminPath(request) && !isAdminSignInPage(request) && !isAuthenticated) {
            return nextjsMiddlewareRedirect(request, "/admin/login");
        }
    }
    // ─── CLIENT MODE (Default) ─────────────────────────────────────────────
    else {
        // STRICT SECURITY: Clients can never see anything starting with /admin
        if (isAdminPath(request)) {
            return nextjsMiddlewareRedirect(request, "/");
        }

        // Redirect to account if already logged in and hitting client auth pages
        if (isClientSignInPage(request) && isAuthenticated) {
            return nextjsMiddlewareRedirect(request, "/account");
        }

        // Redirect /account to /login if not authenticated
        if (isAccountPath(request) && !isAuthenticated) {
            return nextjsMiddlewareRedirect(request, "/login");
        }
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
