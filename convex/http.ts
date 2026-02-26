import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

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
            // Otherwise Safaricom might keep retrying
            return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Success" }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            console.error("M-Pesa Webhook Error:", error);
            // Even on error, we might want to return 200 so Daraja doesn't resend
            // But if it's a parsing error that we can't recover from, 400 is fine
            return new Response("Internal Server Error", { status: 500 });
        }
    }),
});

export default http;
