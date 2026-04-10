import { query } from "./_generated/server";

export const inspect = query({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        const categories = await ctx.db.query("categories").collect();
        
        const catMap = Object.fromEntries(categories.map(c => [c.slug, c._id]));
        const genderStats = products.reduce((acc, p) => {
            acc[p.gender] = (acc[p.gender] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const menFragrances = products.filter(p => 
            p.categoryId === catMap["men"] || 
            (p.categoryId === catMap["perfume"] && p.gender === "men")
        );

        return {
            totalProducts: products.length,
            genderStats,
            menFragranceCount: menFragrances.length,
            menFragranceSample: menFragrances.slice(0, 5).map(p => ({ 
                name: p.name, 
                catId: p.categoryId, 
                catSlug: categories.find(c => c._id === p.categoryId)?.slug,
                gender: p.gender 
            })),
            perfumeId: catMap["perfume"],
            menCatId: catMap["men"],
            categories: categories.map(c => ({ slug: c.slug, id: c._id }))
        };
    }
});
