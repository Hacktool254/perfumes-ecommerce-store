import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { GenericDataModel, GenericMutationCtx } from "convex/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Password],
    callbacks: {
        async afterUserCreatedOrUpdated(ctx: GenericMutationCtx<DataModel>, args) {
            if (args.type === "oauth" || args.type === "email") {
                // Find existing user in our custom table by email, or create new
                const existingUser = await ctx.db
                    .query("users")
                    .withIndex("by_email", (q) => q.eq("email", args.profile.email as string))
                    .unique();


                if (!existingUser) {
                    // If fresh signup, create a customer role
                    await ctx.db.insert("users", {
                        email: args.profile.email as string,
                        hashedPassword: "", // Auth provider handles the real hash securely
                        role: "customer",
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    });
                }
            }
        },
    },
});
