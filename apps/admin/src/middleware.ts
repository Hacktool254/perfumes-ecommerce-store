import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/login", "/register"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    const isAuthenticated = await convexAuth.isAuthenticated();


    // If logged in and hitting login/register, go to dashboard
    if (isSignInPage(request) && isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/");
    }

    // If NOT logged in and NOT on a sign-in page, go to login
    if (!isSignInPage(request) && !isAuthenticated) {
        return nextjsMiddlewareRedirect(request, "/login");
    }
}, { verbose: true });

export const config = {
    // Include /api/* so the middleware can proxy /api/auth actions to Convex.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
