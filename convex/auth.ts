import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { GenericMutationCtx } from "convex/server";

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
            // The auth library creates/updates the user in its `users` table.
            // We patch in our app-specific defaults if they're missing.
            const user = await ctx.db.get(args.userId);

            if (user && !user.role) {
                // If this is the very first user in the entire database, make them an admin.
                const allUsers = await ctx.db.query("users").collect();
                const isFirstUser = allUsers.length === 1;

                await ctx.db.patch(args.userId, {
                    role: isFirstUser ? "admin" : "customer",
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                });
            }
        },
    },
});
