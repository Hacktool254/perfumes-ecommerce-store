import { mutation } from "./_generated/server";

// Map of product names to their real image URLs from lattafa-usa.com
const productImageMap: Record<string, string[]> = {
    "Yara": [
        "https://www.lattafa-usa.com/cdn/shop/files/1_7682153c-2dce-4b60-a9e6-20557f8502cf.png?v=1747500015&width=1240",
    ],
    "Assad": [
        "https://www.lattafa-usa.com/cdn/shop/files/Asad-1_ceed76c7-7a80-46b3-b372-68cc309137f4.png?v=1747421311&width=1240",
    ],
    "Khamrah": [
        "https://www.lattafa-usa.com/cdn/shop/files/Khamrah-1_0ffa4f52-30e3-4dea-9399-9bae4b8cb4af.png?v=1747421472&width=1240",
    ],
    "Sublime": [
        "https://www.lattafa-usa.com/cdn/shop/files/Badee-Al-Oud-Sublime-1.png?v=1747421363&width=1240",
    ],
    "Atheri": [
        "https://www.lattafa-usa.com/cdn/shop/files/Atheeri-1_f93156cf-73d9-4455-8540-5665a4312efb.png?v=1747416765&width=1240",
    ],
    "Rimmah": [
        "https://www.lattafa-usa.com/cdn/shop/files/1_e42e4d3e-a719-4178-9bb0-6e998d1973ae.png?v=1747498725&width=1240",
    ],
    "Nebras": [
        "https://www.lattafa-usa.com/cdn/shop/files/1_fec4173e-be08-4afa-9cf2-4e9e2285d48f.png?v=1747550775&width=1240",
    ],
    "Haya": [
        "https://www.lattafa-usa.com/cdn/shop/files/Haya-1.png?v=1747421439&width=1240",
    ],
    "Mayar": [
        "https://www.lattafa-usa.com/cdn/shop/files/Mayar-Natural-Intense-1_2b8dfe9b-6ebd-4d24-99e6-68565cda61d5.png?v=1747416289&width=1240",
    ],
    "Teriaq": [
        "https://www.lattafa-usa.com/cdn/shop/files/Teriaq-1_9cd52e8c-943a-4aa4-be16-2a30638fc421.png?v=1747416456&width=1240",
    ],
    "Scarlet": [
        "https://www.lattafa-usa.com/cdn/shop/files/ANA_ABIYEDH_SCARLET.png?v=1756142896&width=1240",
    ],
    "Sakeena": [
        "https://www.lattafa-usa.com/cdn/shop/files/Sakeena-1.png?v=1747422013&width=1240",
    ],
    "Fakhar Femme": [
        "https://www.lattafa-usa.com/cdn/shop/files/1_aef6a220-3fcb-4b87-838d-7f704806476f.png?v=1750614271&width=1240",
    ],
    "Ansaam Gold": [
        "https://www.lattafa-usa.com/cdn/shop/files/1_97553617-4548-450d-88eb-2fb032306f94.png?v=1749363699&width=1240",
    ],
    "The Kingdom": [
        "https://www.lattafa-usa.com/cdn/shop/files/The-Kingdom-Men-1_ecd1b262-1319-4fee-846b-8b6f30939677.png?v=1747416549&width=1240",
    ],
};

export const updateProductImages = mutation({
    args: {},
    handler: async (ctx) => {
        let updatedCount = 0;
        let skippedCount = 0;

        const allProducts = await ctx.db.query("products").collect();

        for (const product of allProducts) {
            const imageUrls = productImageMap[product.name];
            if (imageUrls) {
                await ctx.db.patch(product._id, {
                    images: imageUrls,
                    updatedAt: Date.now(),
                });
                updatedCount++;
            } else {
                skippedCount++;
            }
        }

        return {
            updatedCount,
            skippedCount,
            message: `Updated ${updatedCount} products with real images. ${skippedCount} products kept their existing images.`,
        };
    },
});
