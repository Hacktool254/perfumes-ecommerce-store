import { mutation } from "./_generated/server";

const imageMap: Record<string, string[]> = {
    // Exact matches
    "assad": ["https://lattafa-usa.com/cdn/shop/products/1_d2b0cb3e-10de-441c-8ff5-ab3dd6209fb6.png"],
    "asad": ["https://lattafa-usa.com/cdn/shop/products/1_d2b0cb3e-10de-441c-8ff5-ab3dd6209fb6.png"],
    "khamrah": ["https://lattafa-usa.com/cdn/shop/products/Khamrah_1.jpg"],
    "yara": ["https://lattafa-usa.com/cdn/shop/files/Yara_tous.png"],
    "fakhar black": ["https://lattafa-usa.com/cdn/shop/products/Lattafa-Fakhar-Black.png"],
    "now rave": ["https://lattafa-usa.com/cdn/shop/files/A7308709-32BD-4D2A-B900-3FCFCDE132BD.png"],
    "now pink (women)": ["https://lattafa-usa.com/cdn/shop/files/Yara_tous.png"], 
    "nebras": ["https://cdn.shopify.com/s/files/1/0754/4936/8799/files/IMG-1145.png?v=1755360827"],
    "teriaq": ["https://cdn.shopify.com/s/files/1/0754/4936/8799/files/274a9aa7401944c09ecdcdc2d95deb1e_tplv-fhlh96nyum-origin-jpeg.jpg?v=1764632151"],
    "sublime": ["https://cdn.shopify.com/s/files/1/0754/4936/8799/files/ce873b64de89401da52da77068878183_tplv-fhlh96nyum-origin-jpeg.jpg?v=1764632749"],
    "sakeena": ["https://cdn.shopify.com/s/files/1/0754/4936/8799/files/Sakeena-1.png?v=1747422013"],
    "ansaam gold": ["https://cdn.shopify.com/s/files/1/0754/4936/8799/files/1_97553617-4548-450d-88eb-2fb032306f94.png?v=1749363699"]
};

const genericLattafaImages = [
    "https://lattafa-usa.com/cdn/shop/products/1_d2b0cb3e-10de-441c-8ff5-ab3dd6209fb6.png",
    "https://lattafa-usa.com/cdn/shop/products/Khamrah_1.jpg",
    "https://cdn.shopify.com/s/files/1/0754/4936/8799/files/IMG-1145.png?v=1755360827"
];

export const run = mutation({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        let updatedCount = 0;
        
        for (const p of products) {
            const searchName = p.name.toLowerCase();
            let selectedImages = p.images;
            let needsUpdate = false;

            // 1. If explicit match exists, force it
            if (imageMap[searchName]) {
                selectedImages = imageMap[searchName];
                needsUpdate = true;
            } 
            // 2. If it's an Unsplash placeholder or blank, force generic Lattafa
            else if (!p.images || p.images.length === 0 || (p.images[0] && p.images[0].includes("unsplash.com"))) {
                const randomIdx = Math.floor(Math.random() * genericLattafaImages.length);
                selectedImages = [genericLattafaImages[randomIdx]];
                needsUpdate = true;
            }

            if (needsUpdate) {
                await ctx.db.patch(p._id, { images: selectedImages });
                updatedCount++;
            }
        }
        return `Updated ${updatedCount} products to use authentic luxury imagery.`;
    }
});
