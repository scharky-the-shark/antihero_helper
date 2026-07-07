const fs = require("fs");
const path = "./logs/users.json";

function load() {
  if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
  return JSON.parse(fs.readFileSync(path));
}

function save(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function getUser(user) {
  const data = load();

  const userId = typeof user === "string" ? user : user.id;
  const username = typeof user === "string" ? null : user.username;
  const tag = typeof user === "string" ? null : user.tag;

  if (!data[userId]) {
    data[userId] = {
      username: username || "Unknown",
      tag: tag || "Unknown",
      warnings: [],
      timeouts: [],
      bans: []
    };
  } else {
    if (tag && data[userId].tag !== tag) {
      data[userId].tag = tag;
    }
  }

  save(data);
  return data[userId];
}

function updateUser(userId, userData) {
  const data = load();
  data[userId] = userData;
  save(data);
}

module.exports = { getUser, updateUser };
