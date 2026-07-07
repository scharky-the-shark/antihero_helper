const automod = require("../utils/automod");
const spamProtection = require("../utils/spamProtection");
const memeModeration = require("../utils/memeModeration");

module.exports = {
    name: "messageCreate",

    async execute(message, client) {

        await memeModeration(message);

        await automod(message, client);
        await spamProtection(message, client);

    }
};