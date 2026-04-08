import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";
import { registerHttp, loginHttp, logoutHttp } from "./httpAuth";

const http = httpRouter();

// ─── Auth routes ─────────────────────────────────────────────────────────────
// @convex-dev/auth registers its own routes for sign-in, sign-out, etc.
auth.addHttpRoutes(http);

// Custom auth routes
http.route({
    path: "/registerHttp",
    method: "POST",
    handler: registerHttp,
});
http.route({
    path: "/registerHttp",
    method: "OPTIONS",
    handler: registerHttp,
});

http.route({
    path: "/loginHttp",
    method: "POST",
    handler: loginHttp,
});
http.route({
    path: "/loginHttp",
    method: "OPTIONS",
    handler: loginHttp,
});

http.route({
    path: "/logoutHttp",
    method: "POST",
    handler: logoutHttp,
});
http.route({
    path: "/logoutHttp",
    method: "OPTIONS",
    handler: logoutHttp,
});

// ─── M-Pesa Callback ────────────────────────────────────────────────────────
http.route({
    path: "/mpesa-callback",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        try {
            const body = await request.text();

            if (!body) {
                return new Response("Bad Request: Missing body", { status: 400 });
            }

            const payload = JSON.parse(body);

            await ctx.runMutation(internal.payments.processSafaricomCallback, {
                rawBody: payload,
            });

            // Always return HTTP 200 to Safaricom as long as we've stored/processed it
            return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Success" }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            console.error("M-Pesa Webhook Error:", error);
            return new Response("Internal Server Error", { status: 500 });
        }
    }),
});

export default http;
