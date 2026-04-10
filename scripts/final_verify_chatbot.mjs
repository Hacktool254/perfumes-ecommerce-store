import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function verifyIntelligence() {
    try {
        console.log("🚀 Testing chatbot intelligence via direct Convex call...");
        console.log(`📡 URL: ${process.env.NEXT_PUBLIC_CONVEX_URL}`);
        
        const result = await client.action(api.chatbotActions.sendMessage, {
            message: "How much is Yara?",
            sessionId: "verify_intel_test"
        });

        console.log("✅ Chatbot Response:");
        console.log("-------------------");
        console.log(result.response);
        console.log("-------------------");
        
        if (result.response.includes("KES") || result.response.includes("4,500")) {
            console.log("🏆 SUCCESS: The bot quoted the actual price from the database!");
        } else {
            console.log("⚠️ WARNING: The response doesn't seem to contain specific pricing data.");
        }
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

verifyIntelligence();
