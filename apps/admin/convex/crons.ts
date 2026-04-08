import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check for abandoned carts every hour
crons.interval(
    "abandoned-cart-recovery",
    { hours: 1 },
    internal.emails.runAbandonedCartRecovery,
);

export default crons;
