import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DEV_URL = "https://tacit-caterpillar-440.convex.cloud";
const client = new ConvexHttpClient(DEV_URL);

async function run() {
    console.log(`🚀 Starting direct wipe and seed for DEVELOPMENT: ${DEV_URL}`);
    
    try {
        console.log("🧹 Clearing products...");
        const clearedCount = await client.mutation(api.debug.clearProducts);
        console.log(`✅ Cleared ${clearedCount} products.`);

        console.log("🌱 Seeding from JSON...");
        const seedResult = await client.mutation(api.seed.seedFromJSON);
        console.log(`✅ Seed results:`, seedResult);

        console.log("📊 Verifying count...");
        const count = await client.query(api.products.listRecent, { limit: 1000 });
        console.log(`🏁 Final count in Development: ${count.length}`);

        if (count.length === 71) {
            console.log("✨ SUCCESS: Development is now perfectly synchronized at 71 products.");
        } else {
            console.log(`❌ STILL MISMATCHED: Expected 71, got ${count.length}`);
        }
    } catch (error) {
        console.error("💥 Error during synchronization:", error);
        process.exit(1);
    }
}

run();
