import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@workspaceRoot/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, sessionId, userEmail, userName, history } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Call the chatbot action with a timeout
        const result = await Promise.race([
            convex.action(api.chatbotActions.sendMessage, {
                message,
                sessionId,
                userEmail: userEmail || "guest@website.com",
                userName: userName || "Guest",
                history,
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 25000)
            ),
        ]) as any;

        // Return the full structured response
        return NextResponse.json({
            response: result.response,
            sessionId: result.sessionId,
            productData: result.productData || null,
            action: result.action || null,
            suggestedProducts: result.suggestedProducts || null,
        });
    } catch (error: any) {
        console.error("Chatbot API error:", error);

        if (error.message === "Timeout") {
            return NextResponse.json(
                {
                    response: "I'm taking a bit longer than usual to think. Could you please try again in a moment? 😊",
                    sessionId: null,
                    productData: null,
                    action: null,
                    suggestedProducts: null,
                },
                { status: 504 }
            );
        }

        return NextResponse.json(
            {
                response: "I'm having a moment! 😅 Please try again in a few seconds. If the issue persists, you can reach us on WhatsApp for instant help! 💬",
                sessionId: null,
                productData: null,
                action: null,
                suggestedProducts: null,
            },
            { status: 500 }
        );
    }
}
