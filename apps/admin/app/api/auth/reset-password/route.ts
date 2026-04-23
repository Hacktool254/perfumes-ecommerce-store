import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@workspaceRoot/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (body.email && !body.token) {
            const origin = request.headers.get("origin") || "https://admin.ummieessence.store";
            await convex.action(api.emails.requestPasswordReset, {
                email: body.email,
                appBaseUrl: origin,
            });
            return NextResponse.json({
                success: true,
                message: "If an account exists with this email, you will receive a reset link shortly.",
            });
        }

        if (body.token && body.newPassword) {
            await convex.action(api.emails.resetPassword, {
                token: body.token,
                newPassword: body.newPassword,
            });
            return NextResponse.json({
                success: true,
                message: "Password reset successfully. You can now sign in.",
            });
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Something went wrong." },
            { status: 400 }
        );
    }
}
