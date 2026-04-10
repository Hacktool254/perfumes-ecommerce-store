import { ConvexHttpClient } from "convex/browser";

const DEV_URL = "https://tacit-caterpillar-440.convex.cloud";

async function findDuplicates() {
    const client = new ConvexHttpClient(DEV_URL);
    try {
        const products = await client.query("products:listRecent", { limit: 200 });
        const names = products.map(p => p.name);
        const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
        
        console.log(`Total Products: ${products.length}`);
        console.log("Duplicates found:", duplicates);
        
        if (duplicates.length > 0) {
            const firstDup = products.find(p => p.name === duplicates[0]);
            const secondDup = products.findLast(p => p.name === duplicates[0]);
            console.log("\nDuplicate Entry 1:", JSON.stringify(firstDup, null, 2));
            console.log("\nDuplicate Entry 2:", JSON.stringify(secondDup, null, 2));
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

findDuplicates();
