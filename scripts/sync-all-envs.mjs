#!/usr/bin/env node
/**
 * sync-all-envs.mjs
 * 
 * Pushes ALL required environment variables to:
 *   1. Convex production deployment
 *   2. Vercel admin project (perfumes-ecommerce-store-admin)
 * 
 * Uses Node child_process with stdin piping to avoid shell escaping
 * issues with PEM keys containing newlines.
 * 
 * Usage:  node scripts/sync-all-envs.mjs
 */

import { execSync, spawnSync } from "child_process";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

// ─── Read .env.local ────────────────────────────────────────────────
const envPath = resolve(ROOT, ".env.local");
const envContent = readFileSync(envPath, "utf8");

function getEnvValue(key) {
  // Try quoted value first (double or single quotes, possibly multiline)
  const regexQuoted = new RegExp(`^${key}="((?:[^"\\\\]|\\\\.)*)"`, "m");
  let match = envContent.match(regexQuoted);
  if (match) {
    // Convert literal \\n sequences to actual newlines for PEM keys
    return match[1].replace(/\\\\n/g, "\n");
  }

  // Try single-quoted
  const regexSingle = new RegExp(`^${key}='((?:[^'\\\\]|\\\\.)*)'`, "m");
  match = envContent.match(regexSingle);
  if (match) {
    return match[1].replace(/\\\\n/g, "\n");
  }

  // Unquoted
  const regexUnquoted = new RegExp(`^${key}=(.+)$`, "m");
  match = envContent.match(regexUnquoted);
  if (match) {
    return match[1].trim().replace(/\\\\n/g, "\n");
  }

  return null;
}

// ─── Environment variables to sync ──────────────────────────────────

const CONVEX_VARS = {
  // Auth keys (PEM — critical, must have real newlines)
  JWT_PRIVATE_KEY: getEnvValue("JWT_PRIVATE_KEY"),
  CONVEX_AUTH_PRIVATE_KEY: getEnvValue("CONVEX_AUTH_PRIVATE_KEY"),
  CONVEX_AUTH_SECRET: getEnvValue("CONVEX_AUTH_SECRET"),
  CONVEX_SITE_URL: getEnvValue("CONVEX_SITE_URL") || getEnvValue("NEXT_PUBLIC_CONVEX_SITE_URL"),
  
  // M-Pesa
  MPESA_CONSUMER_KEY: getEnvValue("MPESA_CONSUMER_KEY"),
  MPESA_CONSUMER_SECRET: getEnvValue("MPESA_CONSUMER_SECRET"),
  MPESA_SHORTCODE: getEnvValue("MPESA_SHORTCODE"),
  MPESA_PASSKEY: getEnvValue("MPESA_PASSKEY"),
  MPESA_CALLBACK_URL: getEnvValue("MPESA_CALLBACK_URL"),
  
  // Email
  RESEND_API_KEY: getEnvValue("RESEND_API_KEY"),
  
  // AI
  GOOGLE_AI_API_KEY: getEnvValue("GOOGLE_AI_API_KEY"),
};

const VERCEL_ADMIN_VARS = {
  // Convex connection (CRITICAL — these were empty!)
  NEXT_PUBLIC_CONVEX_URL: getEnvValue("NEXT_PUBLIC_CONVEX_URL"),
  NEXT_PUBLIC_CONVEX_SITE_URL: getEnvValue("NEXT_PUBLIC_CONVEX_SITE_URL"),
  CONVEX_DEPLOYMENT: getEnvValue("CONVEX_DEPLOYMENT"),
  CONVEX_DEPLOY_KEY: getEnvValue("CONVEX_DEPLOY_KEY"),
  CONVEX_SITE_URL: getEnvValue("CONVEX_SITE_URL") || getEnvValue("NEXT_PUBLIC_CONVEX_SITE_URL"),
  
  // Auth (needed for middleware JWT validation)
  CONVEX_AUTH_SECRET: getEnvValue("CONVEX_AUTH_SECRET"),
  JWT_PRIVATE_KEY: getEnvValue("JWT_PRIVATE_KEY"),
  CONVEX_AUTH_PRIVATE_KEY: getEnvValue("CONVEX_AUTH_PRIVATE_KEY"),
  NEXT_PUBLIC_CONVEX_AUTH_PUBLIC_KEY: getEnvValue("NEXT_PUBLIC_CONVEX_AUTH_PUBLIC_KEY"),
  
  // M-Pesa
  MPESA_CONSUMER_KEY: getEnvValue("MPESA_CONSUMER_KEY"),
  MPESA_CONSUMER_SECRET: getEnvValue("MPESA_CONSUMER_SECRET"),
  MPESA_SHORTCODE: getEnvValue("MPESA_SHORTCODE"),
  MPESA_PASSKEY: getEnvValue("MPESA_PASSKEY"),
  MPESA_CALLBACK_URL: getEnvValue("MPESA_CALLBACK_URL"),
  
  // Email
  RESEND_API_KEY: getEnvValue("RESEND_API_KEY"),
  
  // AI
  GOOGLE_AI_API_KEY: getEnvValue("GOOGLE_AI_API_KEY"),
};

// ─── Helper: Set Convex env var via stdin ────────────────────────────
function setConvexEnv(name, value) {
  if (!value) {
    console.log(`  ⚠ Skipping ${name} (no value found)`);
    return false;
  }
  
  console.log(`  Setting ${name}...`);
  try {
    // Use stdin to pipe the value — avoids shell escaping issues with PEM newlines
    const result = spawnSync(
      "npx", ["convex", "env", "set", name, "--", value],
      { 
        cwd: ROOT,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, CONVEX_DEPLOY_KEY: getEnvValue("CONVEX_DEPLOY_KEY") },
        timeout: 30000,
      }
    );
    
    if (result.status !== 0) {
      const stderr = result.stderr?.toString() || "";
      console.log(`  ⚠ Warning for ${name}: ${stderr.trim() || "non-zero exit"}`);
      return false;
    }
    
    console.log(`  ✅ ${name} set successfully`);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed to set ${name}:`, err.message);
    return false;
  }
}

// ─── Helper: Set Vercel env var via stdin ─────────────────────────────
function setVercelEnv(name, value, projectName) {
  if (!value) {
    console.log(`  ⚠ Skipping ${name} (no value found)`);
    return false;
  }

  console.log(`  Setting ${name}...`);
  try {
    // First try to remove existing var (ignore errors if it doesn't exist)
    spawnSync(
      "npx", ["vercel", "env", "rm", name, "production", "--yes", "--scope", "hacktool254"],
      {
        cwd: resolve(ROOT, "apps/admin"),
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 30000,
      }
    );
    
    // Add the new value via stdin — Vercel CLI reads from stdin
    const result = spawnSync(
      "npx", ["vercel", "env", "add", name, "production", "--scope", "hacktool254"],
      {
        cwd: resolve(ROOT, "apps/admin"),
        input: value,
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 30000,
      }
    );
    
    if (result.status !== 0) {
      const stderr = result.stderr?.toString() || "";
      const stdout = result.stdout?.toString() || "";
      // Sometimes Vercel outputs to stdout even on "error"
      if (stdout.includes("Added") || stdout.includes("updated")) {
        console.log(`  ✅ ${name} set successfully`);
        return true;
      }
      console.log(`  ⚠ Warning for ${name}: ${(stderr || stdout).trim().substring(0, 200)}`);
      return false;
    }
    
    console.log(`  ✅ ${name} set successfully`);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed to set ${name}:`, err.message);
    return false;
  }
}

// ─── Main ────────────────────────────────────────────────────────────

console.log("\n╔══════════════════════════════════════════════════════════╗");
console.log("║     ENVIRONMENT VARIABLE SYNC — Production Fix         ║");
console.log("╚══════════════════════════════════════════════════════════╝\n");

// Show what we're working with
console.log("📋 Values found in .env.local:");
for (const [key, val] of Object.entries(VERCEL_ADMIN_VARS)) {
  const display = val 
    ? (val.length > 40 ? `${val.substring(0, 20)}...${val.substring(val.length - 10)} (${val.length} chars)` : val) 
    : "⚠ MISSING";
  console.log(`   ${key}: ${display}`);
}
console.log();

// ── Step 1: Push to Convex ──────────────────────────────────────────
console.log("═══ Step 1: Syncing Convex Production Environment ═══\n");

let convexOk = 0, convexFail = 0;
for (const [name, value] of Object.entries(CONVEX_VARS)) {
  if (setConvexEnv(name, value)) convexOk++;
  else convexFail++;
}
console.log(`\n   Convex: ${convexOk} succeeded, ${convexFail} failed/skipped\n`);

// ── Step 2: Push to Vercel Admin ────────────────────────────────────
console.log("═══ Step 2: Syncing Vercel Admin Environment ═══\n");

let vercelOk = 0, vercelFail = 0;
for (const [name, value] of Object.entries(VERCEL_ADMIN_VARS)) {
  if (setVercelEnv(name, value, "perfumes-ecommerce-store-admin")) vercelOk++;
  else vercelFail++;
}
console.log(`\n   Vercel Admin: ${vercelOk} succeeded, ${vercelFail} failed/skipped\n`);

// ── Summary ──────────────────────────────────────────────────────────
console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║     SYNC COMPLETE                                       ║");
console.log("╚══════════════════════════════════════════════════════════╝");
console.log(`\n   Convex:  ${convexOk}/${Object.keys(CONVEX_VARS).length} vars set`);
console.log(`   Vercel:  ${vercelOk}/${Object.keys(VERCEL_ADMIN_VARS).length} vars set`);
console.log("\n   Next steps:");
console.log("   1. Run: npx convex deploy --prod");
console.log("   2. Run: cd apps/admin && npx vercel --prod");
console.log("   3. Test login at the production URL\n");
