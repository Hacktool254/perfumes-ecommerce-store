import { ConvexHttpClient } from "convex/browser";
import fs from "fs";

const PROD_URL = "https://polished-badger-601.convex.cloud";
const DEV_URL = "https://tacit-caterpillar-440.convex.cloud";

async function compareEnvironments() {
    const prodClient = new ConvexHttpClient(PROD_URL);
    const devClient = new ConvexHttpClient(DEV_URL);
    const seed = JSON.parse(fs.readFileSync('convex/seed_products.json', 'utf8')).products.map(p => p.name.toLowerCase());

    try {
        console.log("🔍 Fetching products from both environments...");
        const prodProducts = await prodClient.query("products:listRecent", { limit: 1000 });
        const devProducts = await devClient.query("products:listRecent", { limit: 1000 });

        const prodNames = prodProducts.map(p => p.name);
        const devNames = devProducts.map(p => p.name);

        console.log("\n--- Comparison Report ---");
        
        // 1. In Prod but not in Seed
        const prodNotSeed = prodProducts.filter(p => !seed.includes(p.name.toLowerCase()));
        console.log(`\n❌ Products in Production NOT in official seed list (${prodNotSeed.length}):`);
        console.log(prodNotSeed.map(p => ` - ${p.name} (${p.brand})`));

        // 1b. In Dev but not in Seed
        const devNotSeed = devProducts.filter(p => !seed.includes(p.name.toLowerCase()));
        console.log(`\n❌ Products in Development NOT in official seed list (${devNotSeed.length}):`);
        console.log(devNotSeed.map(p => ` - ${p.name} (${p.brand})`));

        // 2. In Prod but not in Dev
        const prodNotDev = prodNames.filter(n => !devNames.includes(n));
        console.log(`\n⚠️ Products in Production NOT in Development (${prodNotDev.length}):`);
        console.log(prodNotDev.map(n => ` - ${n}`));

        // 3. In Dev but not in Prod
        const devNotProd = devNames.filter(n => !prodNames.includes(n));
        console.log(`\n⚠️ Products in Development NOT in Production (${devNotProd.length}):`);
        console.log(devNotProd.map(n => ` - ${n}`));

        console.log("\n--- Conclusion ---");
        console.log(`Production Count: ${prodNames.length}`);
        console.log(`Development Count: ${devNames.length}`);
        console.log(`Official Seed Count: ${seed.length}`);

    } catch (error) {
        console.error("❌ Comparison failed:", error.message);
    }
}

compareEnvironments();
