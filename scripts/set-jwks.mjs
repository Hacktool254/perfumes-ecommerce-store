/**
 * Set the JWKS environment variable on the Convex production deployment.
 * This uses stdin to avoid shell escaping issues with the JSON value.
 */
import { execSync } from "child_process";
import { importPKCS8, exportJWK } from "jose";

const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD3jhlb3MSmHF8Q
lMPk1/2SV0Vs6wKXrl8bf49VjdvDDgkyTzcE8pDxRScJB2FRWJKMSDx4zhaBZDQ0
2iH9Hb1xYYXPffFU7PNFk4mEZGzWhlq0Crzs5sDVVOUwvyFEGRgHY4Q7eC/LVLav
3nOfcF+ybJHD37xTibOrU4/ngsPE/yx51zJSvLVEdknF6H+9zsaqeDdhQz//NGgY
/2RQSj01ADW+26C8Aa5hzToVBI65NbatBmlhMzgqKw7t6mQudj4yN9UzhEOsM6X2
cp4mdsRa87fJaivEWWy3O1ntZRzKQiKI6cJOeEEoAREmf0EO8BSQtSR6HHx3tfhk
3EPynxTJAgMBAAECggEAYi05w2PHnXUtAn9tPSmnx8zSnMKLMaqWz2oEZ1KuMCo1
3Xzq/gxRDU52j68cmk09OWNAkExzQneB+N/1kNOlmPyrO8Hf3uVmCVbct+O4AlAg
UrzbdjyBh1l216FFSSOGkw+VlpwwoDwFg7P+OOIxIarLGFp37s1ysuSd8pu6ljox
NNzdCEtWTAMAsNkcix2kOa2//MsBoSPOd6b+XzvDUvtJYf8tqGZ+XoUcV1rtZALH
aUm+ENmjvy7/DJ5nKsIb7poH8TLbiuoFZZyRrKe8iCaPRpjUlGXvPClyHlQECsfG
BY2jHRT988k3Nzvp1fI2IKyj69lJuwHqgCnzrKK0jQKBgQD8GB6zmsl282en0jM2
ljZBETpEy7vH+BPO7OsKiFnR6Vwf/ywHaC8hd2jVcaQ3Sx3dZKu8Rwf9sLSqLbNJ
bDwSYYoXxykhxt6B/nOpsDMPbJe9S8iKrjCZjIAyWiy8xcoEUMSDYbXvkL35l3uB
WvNmsfAWPn9eNx7GYGLHmAQMbwKBgQD7Y/m9UiGwKg9OKcjBJlBDGd4f3faCOH+4
LJFDO64WMBr8PFEYhNyoiyHe21lIKfE+gYUBkPUebzs3EACKQREzNIYotlkOg56O
W4QoWOYdR0pDx6FNbpVzEFPZf/QBbyHHWlEmCaqezcSVj0eA2DQSiKrKcX+nBTsT
x03nLS9+RwKBgHwBqWiUJbI7vauR/NtHPNz5Cn648WBGqgfKBzyhIf3eGxEqRpBG
MZj20jzcr/j7HG/Bi7EMB+RFPjnQTTc65Lnt/S4BLDyPRPkRH/hC0nst4d6eHsIJ
OaLuuEkMjqE1clB5IpG2SPbVbn4OhBR3lu/Xa9ClYaYI2zyeQTkJkERFAoGAcxpA
g+2yHQ30+g3prH5Va5PRf3fK4a7q07IcRNNzjxcxk+IuI3LZ8ZXayUZXp9IEcmEt
PB1aDjhRvZFnHeZS8MYQ011Cg4HCPF4ssaianDdDCqvB8Ek8xnVoXwLV/z4aEkQJ
OchdRd7jLrNuwtC7bu0CfjTfhOLBPPoZckrfHwsCgYEAsj8nlt5i6IPYBgvhP3mF
/7bhf6D+0Wk6o0+H/+vb/J7RZOsXPM6k9HnWyMKpo2/+bjfIXHbmQ4bXZXSZvgnp
KhDsKo4EMqQKxwqLPmEDTn7Wdz0Q05xthTl7ufBWk7Nb86aRUs8TvG10w3GnbkmN
QyW3rKEf2Tde5/QYptAEdXg=
-----END PRIVATE KEY-----`;

async function main() {
  const privateKey = await importPKCS8(privateKeyPem, "RS256");
  const publicJwk = await exportJWK(privateKey);
  const jwks = JSON.stringify({
    keys: [{ use: "sig", kty: publicJwk.kty, n: publicJwk.n, e: publicJwk.e }],
  });

  console.log("Setting JWKS on Convex production deployment...");
  console.log("JWKS value:", jwks);

  try {
    const result = execSync(`npx convex env set JWKS`, {
      input: jwks,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    console.log("Result:", result);
  } catch (err) {
    // The stdin approach may not work, try with file
    console.log("Stdin approach didn't work, trying direct approach...");
    
    // Write to temp file and use that
    const fs = await import("fs");
    const tmpFile = "scripts/_jwks_tmp.txt";
    fs.writeFileSync(tmpFile, jwks);
    
    try {
      // Try using PowerShell's Get-Content for piping
      const result2 = execSync(
        `npx convex env set JWKS "${jwks.replace(/"/g, '\\"')}"`,
        { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
      );
      console.log("Result:", result2);
    } catch (err2) {
      console.error("Direct approach also failed:", err2.stderr || err2.message);
      console.log("\n========================================");
      console.log("MANUAL STEP REQUIRED:");
      console.log("========================================");
      console.log("Go to https://dashboard.convex.dev");
      console.log("Select deployment: polished-badger-601");
      console.log("Go to Settings > Environment Variables");
      console.log("Add a new variable:");
      console.log("  Name:  JWKS");
      console.log("  Value: " + jwks);
      console.log("========================================\n");
    }

    // Clean up
    try { fs.unlinkSync(tmpFile); } catch {}
  }
}

main();
