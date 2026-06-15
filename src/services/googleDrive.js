const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const TOKEN_PATH = path.join(process.cwd(), "credentials", "token.json");

const CLIENT_PATH = path.join(
  process.cwd(),
  "credentials",
  "oauth-client.json",
);

async function getDriveClient() {
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));

  const credentials = JSON.parse(fs.readFileSync(CLIENT_PATH, "utf8"));

  const { client_id, client_secret, redirect_uris } = credentials.installed;

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  oauth2Client.setCredentials(token);

  return google.drive({
    version: "v3",
    auth: oauth2Client,
  });
}

async function verifyFolderAccess(folderId) {
  const drive = await getDriveClient();

  const response = await drive.files.get({
    fileId: folderId,
    fields: "id,name,mimeType",
  });

  return response.data;
}

async function uploadFile(filePath, fileName, folderId) {
  const drive = await getDriveClient();

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },

    media: {
      mimeType: "application/octet-stream",

      body: fs.createReadStream(filePath),
    },

    fields: "id,name",
  });

  return response.data;
}

async function deleteFile(fileId) {
  const drive = await getDriveClient();

  await drive.files.delete({
    fileId,
  });
}

module.exports = {
  getDriveClient,
  verifyFolderAccess,
  uploadFile,
  deleteFile,
};
