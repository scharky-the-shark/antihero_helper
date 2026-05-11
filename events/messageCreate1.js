const automod = require("../utils/automod");
const spamProtection = require("../utils/spamProtection");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {

    await automod(message, client);
    await spamProtection(message, client);

  }
};
