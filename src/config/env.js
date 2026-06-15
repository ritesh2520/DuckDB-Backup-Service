const dotenv = require("dotenv");

dotenv.config();

const required = ["DUCKDB_FOLDER", "TIMEZONE", "GOOGLE_DRIVE_FOLDER_ID"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

module.exports = {
  duckdbFolder: process.env.DUCKDB_FOLDER,

  timezone: process.env.TIMEZONE,

  driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID,

  backupRetentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || "7", 10),
};
