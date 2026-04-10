import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function checkConversations() {
    try {
        console.log("Checking chatbotConversations table...");
        const conversations = await client.query(api.chatbot.getProductsForChatbot); // Just testing connection
        console.log("Connection successful.");
        
        // Note: There isn't a direct listConversations query in the provided code, 
        // but we can check if any were logged recently if we had a query for it.
        // Since I can't easily add a new query and wait for deployment, 
        // I'll check the logs of the dev server again.
    } catch (error) {
        console.error("Verification failed:", error);
    }
}

checkConversations();
