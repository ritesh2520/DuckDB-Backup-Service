const cron = require("node-cron");

const { runBackupJob } = require("../jobs/backupJob");
const config = require("../config/env");

function startScheduler() {
  console.log("Scheduler Started");
  console.log("Timezone:", config.timezone);

  cron.schedule(
    "0 */3 * * *",
    async () => {
      console.log("Cron Triggered:", new Date().toISOString());

      try {
        await runBackupJob();
      } catch (error) {
        console.error("Scheduled Backup Failed:", error.message);
      }
    },
    {
      timezone: config.timezone,
    },
  );
}

module.exports = {
  startScheduler,
};
  