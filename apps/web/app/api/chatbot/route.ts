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
            callChatbotAction({
                message,
                sessionId,
                userEmail: userEmail || "guest@website.com",
                userName: userName || "Guest",
                history,
            }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Timeout")), 25000)
            )
        ]) as any;

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Chatbot API error:", error);
        
        if (error.message === "Timeout") {
            return NextResponse.json(
                {
                    response: "I'm taking a bit longer than usual to think. Could you please try again in a moment?",
                    error: "Request timeout",
                },
                { status: 504 }
            );
        }

        return NextResponse.json(
            {
                response: "I'm having trouble processing your message. Please try again in a moment.",
                error: "Internal server error",
            },
            { status: 500 }
        );
    }
}

async function callChatbotAction(params: {
    message: string;
    sessionId?: string;
    userEmail?: string;
    userName?: string;
    history?: { role: string; content: string }[];
}) {
    try {
        const result = await convex.action(api.chatbotActions.sendMessage, {
            message: params.message,
            sessionId: params.sessionId,
            userEmail: params.userEmail,
            userName: params.userName,
            history: params.history,
        });

        if (!result || !result.response) {
            throw new Error("Empty response from Convex action");
        }

        return {
            response: result.response,
            sessionId: result.sessionId,
            productData: result.productData,
        };
    } catch (error) {
        console.error("Convex chatbot action failed, falling back to n8n:", error);
        // Fallback to direct n8n call if Convex action fails
        const n8nResult = await callN8nWebhook(params);
        return {
            response: n8nResult.response || n8nResult.message || "I'm not sure how to respond to that.",
            sessionId: params.sessionId || `session_${Date.now()}`,
            productData: n8nResult.products || null,
        };
    }
}
/**
 * Direct n8n webhook call (fallback method)
 */
async function callN8nWebhook(params: {
    message: string;
    sessionId?: string;
    userEmail?: string;
    userName?: string;
}) {
    const n8nUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/whatsapp-chatbot";

    try {
        const response = await fetch(n8nUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: params.message,
                from: params.userEmail || "website-user",
                name: params.userName || "Guest",
                sessionId: params.sessionId || `session_${Date.now()}`,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`n8n webhook failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("n8n fallback also failed:", error);
        return { response: "I'm currently unable to process your request. Please try again later." };
    }
}
