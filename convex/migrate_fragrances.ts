import { mutation } from "./_generated/server";

/**
 * Migration mutation to permanently move perfumes into their dedicated fragrance collections
 * based on their gender metadata. This fulfills the requirement for the database state
 * to match the desired category filtering across the entire application.
 */
export const migrate = mutation({
  handler: async (ctx) => {
    // 1. Fetch special categories to find target IDs
    const categories = await ctx.db.query("categories").collect();
    const menCat = categories.find(c => c.slug === "men");
    const womenCat = categories.find(c => c.slug === "women");
    const unisexCat = categories.find(c => c.slug === "unisex");
    const perfumeCat = categories.find(c => c.slug === "perfume");

    if (!menCat || !womenCat || !unisexCat || !perfumeCat) {
      return { 
        error: "Migration failed: One or more special categories could not be found by slug.",
        foundSlugs: categories.map(c => c.slug)
      };
    }

    // 2. Fetch all products currently categorized as general 'Perfume'
    const products = await ctx.db.query("products")
      .filter(q => q.eq(q.field("categoryId"), perfumeCat._id))
      .collect();

    let updatedCount = 0;
    const updates = [];

    // 3. Re-assign categoryId based on gender
    for (const p of products) {
      let targetCatId = null;
      if (p.gender === "men") targetCatId = menCat._id;
      else if (p.gender === "women") targetCatId = womenCat._id;
      else if (p.gender === "unisex") targetCatId = unisexCat._id;

      if (targetCatId && targetCatId !== p.categoryId) {
        await ctx.db.patch(p._id, { categoryId: targetCatId });
        updates.push({ name: p.name, from: "perfume", to: categories.find(c => c._id === targetCatId)?.slug });
        updatedCount++;
      }
    }

    return { 
      success: true,
      message: `Successfully migrated ${updatedCount} perfumes to dedicated gendered collections.`,
      details: updates
    };
  }
});
