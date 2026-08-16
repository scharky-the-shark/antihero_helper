const { REST, Routes } = require("discord.js");
const config          = require("./Login.json");

const panel           = require("./panel");
const exportCmd       = require("./export");
const ticketCloseCmd  = require("./ticketclose");
const warnCmd         = require("./warn");
const banCmd          = require("./ban");
const timeoutCmd      = require("./timeout");
const configCmd       = require("./config");
const infoCmd         = require("./info");
const quarantineCmd   = require("./quarantine");
const purgeCmd        = require("./purge");
const clearuserCmd    = require("./clearuser");
const blockCmd        = require("./block");
const resolveCmd      = require("./resolve");
const statsCommand    = require("./stats");
const softbanCommand  = require("./softban");
const forceCommand    = require("./force");
const setupCommand    = require("./setup");

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {

    console.log("Registering slash commands...");

    await rest.put(
        Routes.applicationCommands(config.clientId),
        {
        body: [
          infoCmd.data.toJSON(),
        ]
      }
    );
    console.log("============ SUCCESS ============");
    console.log("Commands registered successfully.");

  } catch (error) {
    console.error("Command registration failed:", error);
  }
})();