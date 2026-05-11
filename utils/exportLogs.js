const fs = require("fs");
const path = require("path");
const { uploadFile } = require("./googleDrive");
const config = require("../Login.json");

const DRIVE_FOLDER = config.export.googleDriveFolderId;
const LOG_DIR = path.join(__dirname, "..", "logs");

function getDate() {
  return new Date().toISOString().split("T")[0];
}

async function exportAllLogs(guild) {
  if (!fs.existsSync(LOG_DIR)) return 0;

  const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith(".txt"));
  let count = 0;

  for (const file of files) {
    const channelId = file.replace(".txt", "");
    const channel = guild.channels.cache.get(channelId);
    if (!channel) continue;

    const filePath = path.join(LOG_DIR, file);
    const newName = `${channel.name}-${getDate()}.txt`;

    await uploadFile(filePath, DRIVE_FOLDER, newName);
    count++;
  }

  return count;
}

module.exports = { exportAllLogs };
