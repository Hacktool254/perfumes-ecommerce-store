import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import fs from "fs";

const DEV_URL = "https://tacit-caterpillar-440.convex.cloud";
const client = new ConvexHttpClient(DEV_URL);

async function run() {
    console.log("🔍 Fetching products from Development...");
    const products = await client.query(api.products.listRecent, { limit: 1000 });
    console.log(`Total: ${products.length}`);

    const seedData = JSON.parse(fs.readFileSync("convex/seed_products.json", "utf8"));
    const seedSlugs = new Set(seedData.products.map(p => {
        // Simple slugify for comparison
        return (p.brand + "-" + p.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    }));

    console.log("--- Development Slugs ---");
    const counts = {};
    for (const p of products) {
        counts[p.slug] = (counts[p.slug] || 0) + 1;
        if (!seedSlugs.has(p.slug)) {
            console.log(`❌ EXTRA SLUG (Not in seed): ${p.slug} (ID: ${p._id})`);
        }
    }

    for (const [slug, count] of Object.entries(counts)) {
        if (count > 1) {
            console.log(`⚠️ DUPLICATE SLUG: ${slug} appears ${count} times.`);
            const dupes = products.filter(p => p.slug === slug);
            dupes.forEach((p, i) => {
                console.log(`   [${i}] ID: ${p._id}`);
            });
        }
    }
}

run();
