const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Extract keys from .env.local
const envPath = path.resolve(__dirname, 'apps/admin/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

function getEnvValue(key) {
  const regex = new RegExp(`^${key}=(["'])(.*)\\1$`, 'm');
  const match = envContent.match(regex);
  if (match) {
    return match[2].replace(/\\n/g, '\n');
  }
  // Try without quotes
  const regexNoQuotes = new RegExp(`^${key}=(.*)$`, 'm');
  const matchNoQuotes = envContent.match(regexNoQuotes);
  if (matchNoQuotes) {
    return matchNoQuotes[1].replace(/\\n/g, '\n');
  }
  return null;
}

const keys = [
  'JWT_PRIVATE_KEY',
  'CONVEX_AUTH_PRIVATE_KEY',
  'NEXT_PUBLIC_CONVEX_AUTH_PUBLIC_KEY'
];

function setConvexEnv(name, value) {
  if (!value) {
    console.error(`Value for ${name} not found in .env.local`);
    return;
  }
  console.log(`Setting Convex env: ${name}...`);
  try {
    // We use stdin to pass the value to avoid shell escaping issues with newlines/special chars
    execSync(`npx convex env set ${name} --prod`, { 
      input: value, 
      stdio: ['pipe', 'inherit', 'inherit'] 
    });
    console.log(`Successfully set ${name} in Convex.`);
  } catch (err) {
    console.error(`Failed to set ${name} in Convex:`, err.message);
  }
}

// Also helpful to set in Vercel if the user has the CLI
function setVercelEnv(name, value) {
    if (!value) return;
    console.log(`Setting Vercel env: ${name}...`);
    try {
        // Vercel CLI doesn't easily support stdin for 'env add', but we can try
        // Actually, it's safer to let the user do this or use a temp file
        // For now, let's focus on Convex as that's where the auth happens
    } catch (err) {
        console.error(`Failed to set ${name} in Vercel:`, err.message);
    }
}

console.log('--- Starting Environment Variable Sync ---');

keys.forEach(key => {
  const val = getEnvValue(key);
  setConvexEnv(key, val);
});

console.log('--- Sync Complete ---');
