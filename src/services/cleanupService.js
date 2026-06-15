const config = require("../config/env");

const { getDriveClient, deleteFile } = require("./googleDrive");

async function cleanupOldBackups() {
  const drive = await getDriveClient();

  const cutoff = new Date();

  cutoff.setDate(cutoff.getDate() - config.backupRetentionDays);

  const response = await drive.files.list({
    q: `'${config.driveFolderId}' in parents`,
    fields: "files(id,name,createdTime)",
    pageSize: 1000,
  });

  const files = response.data.files || [];

  let deleted = 0;

  for (const file of files) {
    const created = new Date(file.createdTime);

    if (created < cutoff) {
      console.log(`Deleting ${file.name}`);

      await deleteFile(file.id);

      deleted++;
    }
  }

  return {
    totalFiles: files.length,
    deleted,
  };
}

module.exports = {
  cleanupOldBackups,
};
