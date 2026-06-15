const fs = require("fs");
const path = require("path");

const { authenticate } = require("@google-cloud/local-auth");

const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "credentials",
  "oauth-client.json",
);

const TOKEN_PATH = path.join(process.cwd(), "credentials", "token.json");

async function main() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(auth.credentials, null, 2));

  console.log("Token saved successfully");
}

main().catch(console.error);
