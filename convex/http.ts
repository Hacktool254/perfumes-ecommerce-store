import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

// ─── Auth routes ─────────────────────────────────────────────────────────────
// @convex-dev/auth registers its own routes for sign-in, sign-out, etc.
auth.addHttpRoutes(http);

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

// ─── WhatsApp Webhook (Meta API - future integration) ────────────────────────
// GET endpoint for Meta verification challenge
http.route({
    path: "/whatsapp-webhook",
    method: "GET",
    handler: httpAction(async (_ctx, request) => {
        const url = new URL(request.url);
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");

        // Verify token should match your WHATSAPP_VERIFY_TOKEN env variable
        const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "ummies_essence_verify";

        if (mode === "subscribe" && token === verifyToken) {
            console.log("WhatsApp webhook verified successfully");
            return new Response(challenge || "", { status: 200 });
        }

        return new Response("Forbidden", { status: 403 });
    }),
});

// POST endpoint for incoming WhatsApp messages
http.route({
    path: "/whatsapp-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        try {
            const body = await request.json();
            console.log("WhatsApp webhook received:", JSON.stringify(body).slice(0, 500));

            // Extract message from Meta's webhook format
            const entry = body?.entry?.[0];
            const change = entry?.changes?.[0];
            const message = change?.value?.messages?.[0];

            if (!message) {
                // Could be a status update, acknowledge it
                return new Response("OK", { status: 200 });
            }

            const from = message.from; // sender's WhatsApp number
            const text = message.text?.body || "";
            const senderName = change?.value?.contacts?.[0]?.profile?.name || "WhatsApp User";

            // TODO: Route to chatbot action when WhatsApp is connected
            // await ctx.runAction(api.chatbotActions.sendMessage, {
            //     message: text,
            //     sessionId: `whatsapp_${from}`,
            //     userEmail: `${from}@whatsapp.com`,
            //     userName: senderName,
            // });

            console.log(`WhatsApp message from ${from} (${senderName}): ${text}`);

            // Always return 200 to Meta
            return new Response("OK", { status: 200 });
        } catch (error) {
            console.error("WhatsApp Webhook Error:", error);
            return new Response("OK", { status: 200 }); // Still return 200 to prevent retries
        }
    }),
});

export default http;
