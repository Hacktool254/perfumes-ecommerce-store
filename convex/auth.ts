import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { GenericMutationCtx } from "convex/server";

if (process.env.CONVEX_AUTH_PRIVATE_KEY) {
    process.env.CONVEX_AUTH_PRIVATE_KEY = process.env.CONVEX_AUTH_PRIVATE_KEY.replace(/\\n/g, "\n");
}
if (process.env.JWT_PRIVATE_KEY) {
    process.env.JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, "\n");
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        Password({
            profile(params) {
                return {
                    email: params.email as string,
                    ...(params.name ? { name: params.name as string } : {}),
                };
            },
        }),
    ],
    callbacks: {
        async afterUserCreatedOrUpdated(ctx: GenericMutationCtx<DataModel>, args) {
            if (!args.userId) {
                console.error("afterUserCreatedOrUpdated called without userId", args);
                return;
            }
            
            // Setup User Profile if missing
            const profile = await ctx.db
                .query("userProfiles")
                .withIndex("by_user", (q) => q.eq("userId", args.userId!))
                .first();

            if (!profile) {
                await ctx.db.insert("userProfiles", {
                    userId: args.userId,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                });
            }

            // Check if this is the very first user in the entire database, make them an admin
            const allAdmins = await ctx.db.query("adminProfiles").collect();
            const isAdmin = await ctx.db
                .query("adminProfiles")
                .withIndex("by_user", (q) => q.eq("userId", args.userId!))
                .first();

            if (allAdmins.length === 0 && !isAdmin) {
                const user = await ctx.db.get(args.userId);
                if (user?.email) {
                    await ctx.db.insert("adminProfiles", {
                        userId: args.userId,
                        email: user.email,
                        username: user.email.split("@")[0],
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    });
                }
            }
        },
    },
});
