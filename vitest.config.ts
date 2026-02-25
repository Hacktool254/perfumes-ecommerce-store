/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environmentMatchGlobs: [
            // Run Convex tests in the edge-runtime environment
            ["convex/**", "edge-runtime"],
        ],
        server: {
            deps: {
                inline: ["convex-test"],
            },
        },
    },
});
