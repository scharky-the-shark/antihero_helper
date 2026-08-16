const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "Login.json");

function getConfig() {
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

function updateConfig(newData) {
  const current = getConfig();
  const updated = { ...current, ...newData };

  fs.writeFileSync(configPath, JSON.stringify(updated, null, 2));
  return updated;
}

module.exports = {
  getConfig,
  updateConfig
};

