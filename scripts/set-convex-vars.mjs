import { spawnSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

const VARS = {
  JWT_PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD3jhlb3MSmHF8Q\nlMPk1/2SV0Vs6wKXrl8bf49VjdvDDgkyTzcE8pDxRScJB2FRWJKMSDx4zhaBZDQ0\n2iH9Hb1xYYXPffFU7PNFk4mEZGzWhlq0Crzs5sDVVOUwvyFEGRgHY4Q7eC/LVLav\n3nOfcF+ybJHD37xTibOrU4/ngsPE/yx51zJSvLVEdknF6H+9zsaqeDdhQz//NGgY\n/2RQSj01ADW+26C8Aa5hzToVBI65NbatBmlhMzgqKw7t6mQudj4yN9UzhEOsM6X2\ncp4mdsRa87fJaivEWWy3O1ntZRzKQiKI6cJOeEEoAREmf0EO8BSQtSR6HHx3tfhk\n3EPynxTJAgMBAAECggEAYi05w2PHnXUtAn9tPSmnx8zSnMKLMaqWz2oEZ1KuMCo1\n3Xzq/gxRDU52j68cmk09OWNAkExzQneB+N/1kNOlmPyrO8Hf3uVmCVbct+O4AlAg\nUrzbdjyBh1l216FFSSOGkw+VlpwwoDwFg7P+OOIxIarLGFp37s1ysuSd8pu6ljox\nNNzdCEtWTAMAsNkcix2kOa2//MsBoSPOd6b+XzvDUvtJYf8tqGZ+XoUcV1rtZALH\naUm+ENmjvy7/DJ5nKsIb7poH8TLbiuoFZZyRrKe8iCaPRpjUlGXvPClyHlQECsfG\nBY2jHRT988k3Nzvp1fI2IKyj69lJuwHqgCnzrKK0jQKBgQD8GB6zmsl282en0jM2\nljZBETpEy7vH+BPO7OsKiFnR6Vwf/ywHaC8hd2jVcaQ3Sx3dZKu8Rwf9sLSqLbNJ\nbDwSYYoXxykhxt6B/nOpsDMPbJe9S8iKrjCZjIAyWiy8xcoEUMSDYbXvkL35l3uB\nWvNmsfAWPn9eNx7GYGLHmAQMbwKBgQD7Y/m9UiGwKg9OKcjBJlBDGd4f3faCOH+4\nLJFDO64WMBr8PFEYhNyoiyHe21lIKfE+gYUBkPUebzs3EACKQREzNIYotlkOg56O\nW4QoWOYdR0pDx6FNbpVzEFPZf/QBbyHHWlEmCaqezcSVj0eA2DQSiKrKcX+nBTsT\nx03nLS9+RwKBgHwBqWiUJbI7vauR/NtHPNz5Cn648WBGqgfKBzyhIf3eGxEqRpBG\nMZj20jzcr/j7HG/Bi7EMB+RFPjnQTTc65Lnt/S4BLDyPRPkRH/hC0nst4d6eHsIJ\nOaLuuEkMjqE1clB5IpG2SPbVbn4OhBR3lu/Xa9ClYaYI2zyeQTkJkERFAoGAcxpA\ng+2yHQ30+g3prH5Va5PRf3fK4a7q07IcRNNzjxcxk+IuI3LZ8ZXayUZXp9IEcmEt\nPB1aDjhRvZFnHeZS8MYQ011Cg4HCPF4ssaianDdDCqvB8Ek8xnVoXwLV/z4aEkQJ\nOchdRd7jLrNuwtC7bu0CfjTfhOLBPPoZckrfHwsCgYEAsj8nlt5i6IPYBgvhP3mF\n/7bhf6D+0Wk6o0+H/+vb/J7RZOsXPM6k9HnWyMKpo2/+bjfIXHbmQ4bXZXSZvgnp\nKhDsKo4EMqQKxwqLPmEDTn7Wdz0Q05xthTl7ufBWk7Nb86aRUs8TvG10w3GnbkmN\nQyW3rKEf2Tde5/QYptAEdXg=\n-----END PRIVATE KEY-----`,
  CONVEX_AUTH_PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA944ZW9zEphxfEJTD5Nf9\nkldFbOsCl65fG3+PVY3bww4JMk83BPKQ8UUnCQdhUViSjEg8eM4WgWQ0NNoh/R29\ncWGFz33xVOzzRZOJhGRs1oZatAq87ObA1VTlML8hRBkYB2OEO3gvy1S2r95zn3Bf\nsmyRw9+8U4mzq1OP54LDxP8sedcyUry1RHZJxeh/vc7Gqng3YUM//zRoGP9kUEo9\nNQA1vtugvAGuYc06FQSOuTW2rQZpYTM4KisO7epkLnY+MjfVM4RDrDOl9nKeJnbE\nWvO3yWorxFlstztZ7WUcykIiiOnCTnhBKAERJn9BDvAUkLUkehx8d7X4ZNxD8p8U\nyQIDAQAB\n-----END PUBLIC KEY-----`,
  CONVEX_AUTH_SECRET: "hDlEM9vRubzUwHa1iJX52e4fSoN8Gxym",
  CONVEX_SITE_URL: "https://polished-badger-601.convex.site",
};

for (const [name, value] of Object.entries(VARS)) {
  console.log(`Setting ${name}...`);
  const result = spawnSync(
    "npx", ["convex", "env", "set", name, "--", value],
    { 
      cwd: ROOT, 
      stdio: "inherit",
      env: { ...process.env, CONVEX_DEPLOY_KEY: "prod:polished-badger-601|eyJ2MiI6ImM0YjFkYjg0YWQ2MjRkMzI4ZWVmM2ZiYWFmMDg4NzZmIn0=" }
    }
  );
  if (result.status !== 0) {
    console.error(`Failed to set ${name}`);
    process.exit(1);
  }
}
console.log("All variables set successfully.");
