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
