#!/usr/bin/env node

import { spawnSync, execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const ADMIN_DIR = resolve(ROOT, "apps/admin");

// Read .env.local
const envContent = readFileSync(resolve(ROOT, ".env.local"), "utf8");

function getEnvValue(key) {
  const regex = new RegExp(`^${key}="((?:[^"\\\\]|\\\\.)*)"`, "m");
  let match = envContent.match(regex);
  if (match) return match[1].replace(/\\\\n/g, "\n");
  
  const regexUnquoted = new RegExp(`^${key}=(.+)$`, "m");
  match = envContent.match(regexUnquoted);
  if (match) return match[1].trim();
  
  return null;
}

const vars = {
  NEXT_PUBLIC_CONVEX_URL: getEnvValue("NEXT_PUBLIC_CONVEX_URL"),
  NEXT_PUBLIC_CONVEX_SITE_URL: getEnvValue("NEXT_PUBLIC_CONVEX_SITE_URL"),
  CONVEX_DEPLOYMENT: getEnvValue("CONVEX_DEPLOYMENT"),
  CONVEX_DEPLOY_KEY: getEnvValue("CONVEX_DEPLOY_KEY"),
  CONVEX_SITE_URL: getEnvValue("CONVEX_SITE_URL"),
  CONVEX_AUTH_SECRET: getEnvValue("CONVEX_AUTH_SECRET"),
  JWT_PRIVATE_KEY: getEnvValue("JWT_PRIVATE_KEY"),
  CONVEX_AUTH_PRIVATE_KEY: getEnvValue("CONVEX_AUTH_PRIVATE_KEY"),
  NEXT_PUBLIC_CONVEX_AUTH_PUBLIC_KEY: getEnvValue("NEXT_PUBLIC_CONVEX_AUTH_PUBLIC_KEY"),
};

console.log("\n══ Setting Vercel Production Env Vars ══\n");

for (const [name, value] of Object.entries(vars)) {
  if (!value) { console.log(`  ⚠ Skip ${name} (no value)`); continue; }
  
  console.log(`  Setting ${name}...`);
  try {
    // Remove if exists
    execSync(`npx vercel env rm ${name} production --yes`, {
      cwd: ADMIN_DIR,
      stdio: "ignore",
      shell: true
    });
  } catch (e) {
    // Ignore if doesn't exist
  }

  try {
    // Add new value using stdin
    const result = spawnSync("npx", ["vercel", "env", "add", name, "production"], {
      cwd: ADMIN_DIR,
      input: value,
      stdio: ["pipe", "inherit", "inherit"],
      shell: true
    });
    
    if (result.status === 0) {
      console.log(`  ✅ ${name}`);
    } else {
      console.error(`  ❌ ${name} failed with status ${result.status}`);
    }
  } catch (err) {
    console.error(`  ❌ ${name}: ${err.message}`);
  }
}

console.log("\n══ Done ══\n");
