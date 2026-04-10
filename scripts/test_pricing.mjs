import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function testSpecificProduct() {
    try {
        console.log("🔍 Testing chatbot intelligence for 'Shower Gel Refreshing Fruits'...");
        const result = await convex.action("chatbotActions:sendMessage", {
            message: "What is the price of the Shower Gel Refreshing Fruits?",
            userEmail: "test@example.com",
            userName: "Tester",
            history: []
        });

        console.log("✅ Response:", result.response);
        if (result.response.includes("5253") || result.response.includes("5,253")) {
            console.log("✨ SUCCESS: Product price correctly identified.");
        } else {
            console.log("❌ FAILURE: Price not found in response.");
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testSpecificProduct();
