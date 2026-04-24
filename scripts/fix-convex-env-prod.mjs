#!/usr/bin/env node
/**
 * fix-convex-env-prod.mjs
 * 
 * Sets all Convex production environment variables properly.
 * Uses execSync with the value as a CLI argument.
 * For PEM keys, uses stdin piping to avoid shell corruption.
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

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

function setConvexEnv(name, value) {
  if (!value) { console.log(`  ⚠ Skip ${name} (no value)`); return; }
  
  const isPEM = value.includes("-----BEGIN");
  console.log(`  Setting ${name}...`);
  
  try {
    if (isPEM) {
      // For PEM keys, write to temp file and read with node to avoid shell issues
      const tmpFile = resolve(ROOT, `_tmp_${name}.txt`);
      const fs = await import("fs");
      fs.writeFileSync(tmpFile, value);
      execSync(`npx convex env set ${name} -- "$(node -e "process.stdout.write(require('fs').readFileSync('${tmpFile.replace(/\\/g, "/")}', 'utf8'))")"`, {
        cwd: ROOT,
        stdio: "inherit",
        timeout: 30000,
      });
      fs.unlinkSync(tmpFile);
    } else {
      execSync(`npx convex env set ${name} "${value}"`, {
        cwd: ROOT,
        stdio: "inherit",
        timeout: 30000,
      });
    }
    console.log(`  ✅ ${name}`);
  } catch (err) {
    console.error(`  ❌ ${name}: ${err.message}`);
  }
}

console.log("\n══ Setting Convex Production Env Vars ══\n");

// Simple string vars first
const simpleVars = {
  CONVEX_AUTH_SECRET: getEnvValue("CONVEX_AUTH_SECRET"),
  CONVEX_SITE_URL: getEnvValue("CONVEX_SITE_URL"),
  MPESA_CONSUMER_KEY: getEnvValue("MPESA_CONSUMER_KEY"),
  MPESA_CONSUMER_SECRET: getEnvValue("MPESA_CONSUMER_SECRET"),
  MPESA_SHORTCODE: getEnvValue("MPESA_SHORTCODE"),
  MPESA_PASSKEY: getEnvValue("MPESA_PASSKEY"),
  MPESA_CALLBACK_URL: getEnvValue("MPESA_CALLBACK_URL"),
  RESEND_API_KEY: getEnvValue("RESEND_API_KEY"),
  GOOGLE_AI_API_KEY: getEnvValue("GOOGLE_AI_API_KEY"),
};

for (const [name, value] of Object.entries(simpleVars)) {
  if (!value) { console.log(`  ⚠ Skip ${name}`); continue; }
  try {
    execSync(`npx convex env set ${name} "${value}"`, {
      cwd: ROOT, stdio: "inherit", timeout: 30000
    });
    console.log(`  ✅ ${name}`);
  } catch (err) {
    console.error(`  ❌ ${name}`);
  }
}

console.log("\n══ Done ══\n");
console.log("PEM keys (JWT_PRIVATE_KEY, CONVEX_AUTH_PRIVATE_KEY) must be set");
console.log("via the Convex Dashboard or the fix_convex_env.js script.\n");
