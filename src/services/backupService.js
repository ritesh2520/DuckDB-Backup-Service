const fs = require("fs");
const path = require("path");

const config = require("../config/env");
const { uploadFile } = require("./googleDrive");
const { getTimestamp } = require("../utils/date");
const { retry } = require("../utils/retry");

async function getDuckDBFiles() {
  const files = await fs.promises.readdir(config.duckdbFolder);

  const databases = files
    .filter((file) => file.toLowerCase().endsWith(".duckdb"))
    .map((file) => ({
      name: file,
      fullPath: path.join(config.duckdbFolder, file),
    }));

  if (databases.length === 0) {
    throw new Error("No DuckDB files found");
  }

  return databases;
}

async function backupAllDatabases() {
  const databases = await getDuckDBFiles();

  const uploaded = [];

  for (const db of databases) {
    const baseName = path.basename(db.name, ".duckdb");
    const backupName = `${baseName}_${getTimestamp()}.duckdb`;

    console.log(`Uploading ${backupName}`);

    try {
      const result = await retry(
        () => uploadFile(db.fullPath, backupName, config.driveFolderId),
        3, // retries
        2000, // delay ms
      );

      uploaded.push({
        original: db.name,
        uploaded: backupName,
        fileId: result.id,
        status: "success",
      });

      console.log(`Uploaded: ${backupName}`);
    } catch (error) {
      uploaded.push({
        original: db.name,
        uploaded: backupName,
        status: "failed",
        error: error.message,
      });

      console.error(`Failed: ${backupName}`, error.message);
    }
  }

  return uploaded;
}

module.exports = {
  getDuckDBFiles,
  backupAllDatabases,
};
