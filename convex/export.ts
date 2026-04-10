import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireAdmin } from "./users";

/**
 * Export all orders for CSV manifestation.
 * Flattens order metadata and total figures.
 */
export const orders = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const allOrders = await ctx.db.query("orders").order("desc").collect();
        
        return allOrders.map(o => ({
            id: o._id,
            date: new Date(o._creationTime).toISOString(),
            customer: o.customerName,
            email: o.customerEmail,
            amount: o.totalAmount,
            status: o.status,
            address: o.shippingAddress,
            phone: o.customerPhone || "N/A"
        }));
    }
});

/**
 * Export full inventory manifest.
 * Includes technical specs and stock levels.
 */
export const inventory = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const products = await ctx.db.query("products").order("desc").collect();
        const categories = await ctx.db.query("categories").collect();
        
        return products.map(p => {
            const category = categories.find(c => c._id === p.categoryId);
            return {
                id: p._id,
                name: p.name,
                brand: p.brand || "Ummies Essence",
                category: category?.name || "Uncategorized",
                price: p.price,
                stock: p.stock,
                status: p.isActive ? "Active" : "Archived",
                size: p.size || "N/A",
                gender: p.gender || "Unisex"
            };
        });
    }
});

/**
 * Export patron database.
 * Consolidated list of all registered spirits.
 */
export const patrons = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const users = await ctx.db.query("users").order("desc").collect();
        
        return users.map(u => ({
            id: u._id,
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || "Anonymous",
            email: u.email || "N/A",
            role: u.role || "customer",
            joined: new Date(u._creationTime).toISOString()
        }));
    }
});

/**
 * Export fiscal revenue report.
 * Aggregated monthly breakdown.
 */
export const revenueReport = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const allOrders = await ctx.db.query("orders").collect();
        const paidOrders = allOrders.filter(o => o.status !== "cancelled");
        
        // Group by month
        const revenueByMonth: Record<string, number> = {};
        const ordersByMonth: Record<string, number> = {};
        
        paidOrders.forEach(o => {
            const month = new Date(o._creationTime).toLocaleString('default', { month: 'long', year: 'numeric' });
            revenueByMonth[month] = (revenueByMonth[month] || 0) + o.totalAmount;
            ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;
        });
        
        return Object.keys(revenueByMonth).map(month => ({
            period: month,
            revenue: revenueByMonth[month],
            orders: ordersByMonth[month],
            aov: Math.round(revenueByMonth[month] / ordersByMonth[month])
        })).sort((a,b) => new Date(b.period).getTime() - new Date(a.period).getTime());
    }
});
