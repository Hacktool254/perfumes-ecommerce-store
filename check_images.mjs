
import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), "apps/web/.env.local") });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function checkProductData() {
    try {
        console.log("Fetching some products to check image URLs...");
        const result = await client.query("products:list", { paginationOpts: { numItems: 5, cursor: null } });
        const products = result.page;
        
        products.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`Images:`, p.images);
        });
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

checkProductData();
