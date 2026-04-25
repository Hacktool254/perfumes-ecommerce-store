import { query } from "./_generated/server";

export const checkEnv = query({
    args: {},
    handler: async (ctx) => {
        return {
            hasAuthSecret: !!process.env.CONVEX_AUTH_SECRET,
            hasJwtKey: !!process.env.JWT_PRIVATE_KEY,
            hasAuthPrivateKey: !!process.env.CONVEX_AUTH_PRIVATE_KEY,
            deployment: process.env.CONVEX_DEPLOYMENT,
        };
    },
});
