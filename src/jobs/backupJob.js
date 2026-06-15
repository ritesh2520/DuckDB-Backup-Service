const { backupAllDatabases } = require("../services/backupService");
const { cleanupOldBackups } = require("../services/cleanupService");

let isRunning = false;

async function runBackupJob() {
  if (isRunning) {
    console.log("Backup already running. Skipping...");
    return;
  }

  isRunning = true;

  console.log("================================");
  console.log("Starting Backup Job");
  console.log(new Date().toISOString());
  console.log("================================");

  try {
    const results = await backupAllDatabases();

    const cleanup = await cleanupOldBackups();

    console.log("================================");
    console.log("Backup Completed");
    console.log(`Uploaded Files: ${results.length}`);
    console.log(
      `Cleanup: ${cleanup.deleted} deleted out of ${cleanup.totalFiles} files`
    );
    console.log("================================");

    return {
      status: "success",
      uploadedFiles: results,
      cleanup,
    };
  } catch (error) {
    console.error("Backup Job Failed");
    console.error(error);

    throw error;
  } finally {
    isRunning = false;
  }
}

module.exports = {
  runBackupJob,
};