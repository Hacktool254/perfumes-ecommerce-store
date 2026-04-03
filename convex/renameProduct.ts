import { mutation } from "./_generated/server";

/**
 * Rename "Agham" → "Angham" and update its images with real Lattafa CDN URLs.
 */
export const renameAghamToAngham = mutation({
    args: {},
    handler: async (ctx) => {
        // Find all products named "Agham" (any brand)
        const products = await ctx.db
            .query("products")
            .filter((q) => q.eq(q.field("name"), "Agham"))
            .collect();

        if (products.length === 0) {
            return { success: false, message: "No product named 'Agham' found in the database." };
        }

        const anghamImages = [
            "https://www.lattafa-usa.com/cdn/shop/files/Angham-1_fea96331-1cd0-467d-be6d-56ad073a7f86.png?v=1747415391&width=1240",
            "https://www.lattafa-usa.com/cdn/shop/files/Angham-2_d0c8cafc-9f70-4912-b001-134fb3c30281.png?v=1747415391&width=1240",
            "https://www.lattafa-usa.com/cdn/shop/files/Angham-3_f839652c-cea5-4576-a7ba-dcb110e77563.png?v=1747415391&width=1240",
        ];

        let updatedCount = 0;

        for (const product of products) {
            // Update name, slug, description, and images
            const newSlug = product.slug.replace(/agham/gi, "angham");
            const newDescription = product.description.replace(/Agham/gi, "Angham");

            await ctx.db.patch(product._id, {
                name: "Angham",
                slug: newSlug,
                description: newDescription,
                images: anghamImages,
                updatedAt: Date.now(),
            });
            updatedCount++;
        }

        return {
            success: true,
            updatedCount,
            message: `Renamed ${updatedCount} product(s) from "Agham" to "Angham" and updated with 3 real product images.`,
        };
    },
});
