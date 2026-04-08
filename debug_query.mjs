
import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";
import path from "path";

// Load .env.local from apps/web
dotenv.config({ path: path.join(process.cwd(), "apps/web/.env.local") });

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL not found");
    process.exit(1);
}

const client = new ConvexHttpClient(url);

async function test() {
    try {
        // We need the api object. Since we are in a script, we might have to use string names if we can't import the generated api easily.
        // But we can try to use the raw query name.
        const slug = "some-slug"; // Replace with a real slug if known, or just test if it fails on any
        console.log(`Testing query products:getBySlug with slug: ${slug}`);
        const result = await client.query("products:getBySlug", { slug });
        console.log("Result:", result);
    } catch (err) {
        console.error("Caught error:");
        console.error(err);
        if (err.message) {
            console.error("Error message:", err.message);
        }
    }
}

test();
