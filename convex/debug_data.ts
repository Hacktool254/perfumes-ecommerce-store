import { query } from "./_generated/server";

export const checkProducts = query({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        const categories = await ctx.db.query("categories").collect();
        
        return {
            totalProducts: products.length,
            categories: categories.map(c => ({ id: c._id, name: c.name, slug: c.slug })),
            menPerfumes: products
                .filter(p => (p.categoryId === categories.find(c => c.slug === "men")?._id) || 
                             (p.categoryId === categories.find(c => c.slug === "perfume")?._id && p.gender === "men"))
                .map(p => ({ name: p.name, categoryId: p.categoryId, gender: p.gender }))
        };
    }
});
