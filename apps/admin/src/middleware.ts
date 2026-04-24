import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/login"]);

// Ensure Vercel Edge Runtime handles literal \n characters in PEM keys correctly
if (process.env.JWT_PRIVATE_KEY) {
  process.env.JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, "\n");
}
if (process.env.CONVEX_AUTH_PRIVATE_KEY) {
  process.env.CONVEX_AUTH_PRIVATE_KEY = process.env.CONVEX_AUTH_PRIVATE_KEY.replace(/\\n/g, "\n");
}

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const isAuthenticated = await convexAuth.isAuthenticated();

    console.log(`[Middleware] path=${request.nextUrl.pathname} auth=${isAuthenticated}`);

    // On login page and already authenticated → go to dashboard
    if (isSignInPage(request) && isAuthenticated) {
      return nextjsMiddlewareRedirect(request, "/");
    }

    // On protected page and NOT authenticated → go to login
    if (!isSignInPage(request) && !isAuthenticated) {
      return nextjsMiddlewareRedirect(request, "/login");
    }

    // Otherwise let through
  },
  { verbose: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
