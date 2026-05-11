const fs = require("fs");
const path = require("path");

const config = require("../Login.json");
const LOG_CHANNELS = config.logging.channelIds;

module.exports = (message) => {

  if (message.author.bot) return;
  if (!LOG_CHANNELS.includes(message.channel.id)) return;

  const dir = path.join(__dirname, "../logs");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const file = path.join(dir, `${message.channel.id}.txt`);

  const line = `[${new Date().toISOString()}] ${message.author.tag}: ${message.content}\n`;

  fs.appendFileSync(file, line);
};