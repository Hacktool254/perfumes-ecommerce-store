import { execSync } from "child_process";

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
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

try {
  const result = execSync("npx convex env set JWT_PRIVATE_KEY", {
    input: PRIVATE_KEY,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  console.log("✅ JWT_PRIVATE_KEY set successfully");
} catch (err) {
  console.error("❌ Error:", err.stderr?.substring(0, 300) || err.message);
}
