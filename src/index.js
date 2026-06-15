const { runBackupJob } = require("./jobs/backupJob");
const { startScheduler } = require("./scheduler/cron");

async function bootstrap() {
  console.log("Shipping Backup Service Started");

  await runBackupJob();

  startScheduler();
}

bootstrap().catch(console.error);
