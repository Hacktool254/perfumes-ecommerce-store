import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/login"]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const isAuthenticated = await convexAuth.isAuthenticated();

    console.log(`[Middleware] path=${request.nextUrl.pathname} auth=${isAuthenticated}`);

    // On protected page and NOT authenticated → go to login
    // NOTE: We deliberately do NOT redirect authenticated users away from /login here.
    // The client-side AuthGuard handles that redirect after it verifies the admin role.
    // Doing it in middleware caused an infinite loop: AuthGuard sends non-admin users to
    // /login, middleware would send them back to /, AuthGuard sends them back to /login...
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
