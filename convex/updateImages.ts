import { mutation } from "./_generated/server";
import imageMapping from "./imageMapping.json";

function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

/** Fix Lattafa perfumes: rename, re-slug, assign images */
export const fixLattafa = mutation({
    handler: async (ctx) => {
        const renames: Record<string, string> = {
            "Angham": "Lattafa Angham", "Ansaam Gold": "Lattafa Ansaam Gold",
            "Assad": "Lattafa Assad", "Atheri": "Lattafa Atheri",
            "Fakhar Femme": "Lattafa Fakhar Femme", "Haya": "Lattafa Haya",
            "Khamrah": "Lattafa Khamrah", "Mayar": "Lattafa Mayar",
            "Nebras": "Lattafa Nebras", "Rimmah": "Lattafa Rimmah",
            "Sakeena": "Lattafa Sakeena", "Scarlet": "Lattafa Scarlet",
            "Sublime": "Lattafa Sublime", "Teriaq": "Lattafa Teriaq",
            "The Kingdom": "Lattafa The Kingdom", "Yara": "Lattafa Yara",
        };
        const map = imageMapping as Record<string, string[]>;
        const products = await ctx.db.query("products").collect();
        const lattafa = products.filter(p => p.brand === "Lattafa" && !p.name.startsWith("Lattafa "));
        let count = 0;
        for (const p of lattafa) {
            const newName = renames[p.name] ?? `Lattafa ${p.name}`;
            const imgs = map[newName] ?? map[`Lattafa ${p.name}`] ?? [];
            await ctx.db.patch(p._id, {
                name: newName,
                slug: toSlug(newName),
                images: imgs,
                updatedAt: Date.now(),
            });
            count++;
        }
        // Also assign images to already-renamed products that still have empty images
        const alreadyRenamed = products.filter(p => p.brand === "Lattafa" && p.name.startsWith("Lattafa ") && (!p.images || p.images.length === 0));
        for (const p of alreadyRenamed) {
            const imgs = map[p.name] ?? [];
            if (imgs.length > 0) {
                await ctx.db.patch(p._id, { images: imgs, slug: toSlug(p.name), updatedAt: Date.now() });
                count++;
            }
        }
        return `Lattafa: updated ${count} products`;
    },
});

/** Fix Rave: prices, stock, images */
export const fixRave = mutation({
    handler: async (ctx) => {
        const map = imageMapping as Record<string, string[]>;
        const ravePrices: Record<string, number> = {
            "Now Rave": 3500, "Now Pink (Women)": 3500,
            "Now Pink [Women]": 3500, "Now Red": 3500,
        };
        const products = await ctx.db.query("products").collect();
        const rave = products.filter(p => p.brand === "Rave");
        let count = 0;
        for (const p of rave) {
            const imgs = map[`Rave - ${p.name}`] ?? map[p.name] ?? p.images ?? [];
            const price = ravePrices[p.name] ?? p.price ?? 3500;
            await ctx.db.patch(p._id, {
                images: imgs,
                price,
                stock: p.stock > 0 ? p.stock : 40,
                updatedAt: Date.now(),
            });
            count++;
        }
        return `Rave: updated ${count} products`;
    },
});

/** Fix all other brands: assign images from mapping if they're missing */
export const fixOtherImages = mutation({
    handler: async (ctx) => {
        const map = imageMapping as Record<string, string[]>;
        const products = await ctx.db.query("products").collect();
        // Only products not Lattafa/Rave, with no images or stale lattafa-usa URLs
        const targets = products.filter(p =>
            p.brand !== "Lattafa" && p.brand !== "Rave" &&
            (!p.images || p.images.length === 0 || p.images.some(i => i.includes("lattafa-usa")))
        );
        let count = 0;
        for (const p of targets) {
            const imgs = map[`${p.brand} - ${p.name}`]
                ?? map[`${p.brand} ${p.name}`]
                ?? map[p.name]
                ?? [];
            await ctx.db.patch(p._id, { images: imgs, updatedAt: Date.now() });
            count++;
        }
        return `Other brands: updated images for ${count} products`;
    },
});

/** Fix slugs that don't match their product name */
export const fixSlugs = mutation({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        let count = 0;
        for (const p of products) {
            const expected = p.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-");
            if (p.slug !== expected) {
                await ctx.db.patch(p._id, { slug: expected, updatedAt: Date.now() });
                count++;
            }
        }
        return `Slugs: fixed ${count} products`;
    },
});

export const fixBallet = mutation({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        const ballet = products.filter(p => p.brand === "Ballet" && p.name === "Body Oil");
        let count = 0;
        
        // We expect two, let's just make one the 125ml and the other 240ml
        // Or if there's only one, we'll duplicate it? Wait, let's see how many there are.
        if (ballet.length >= 1) {
            await ctx.db.patch(ballet[0]._id, {
                name: "Body Oil (125ml) bottle",
                slug: "body-oil-125ml-bottle",
                images: ["/products/Ballet---Body-Oil-125ml-bottle.jpg"],
                updatedAt: Date.now()
            });
            count++;
        }
        if (ballet.length >= 2) {
            await ctx.db.patch(ballet[1]._id, {
                name: "Body Oil (240ml) bottle",
                slug: "body-oil-240ml-bottle",
                images: ["/products/Ballet---Body-Oil-240ml.jpg"],
                updatedAt: Date.now()
            });
            count++;
        }
        
        return `Ballet: updated ${count} products`;
    }
});
