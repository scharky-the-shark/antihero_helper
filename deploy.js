const { REST, Routes } = require("discord.js");
const config          = require("./Login.json");

const panel           = require("./panel");
const exportCmd       = require("./export");
const ticketCloseCmd  = require("./ticketclose");
const warnCmd         = require("./warn");
const banCmd          = require("./ban");
const timeoutCmd      = require("./timeout");
const infoCmd         = require("./info");
const configCmd       = require("./config");

const quarantineCmd   = require("./quarantine");
const purgeCmd        = require("./purge");
const clearuserCmd    = require("./clearuser");
const blockCmd        = require("./block");

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {

    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        config.clientId,
        config.guildId
      ),
      {
        body: [
          panel.data.toJSON(),
          exportCmd.data.toJSON(),
          ticketCloseCmd.data.toJSON(),
          warnCmd.data.toJSON(),
          banCmd.data.toJSON(),
          timeoutCmd.data.toJSON(),
          infoCmd.data.toJSON(),
          configCmd.data.toJSON(),
          quarantineCmd.data.toJSON(),
          purgeCmd.data.toJSON(),
          clearuserCmd.data.toJSON(),
          blockCmd.data.toJSON()
        ]
      }
    );

    console.log("✅ Commands registered successfully.");

  } catch (error) {
    console.error("❌ Command registration failed:", error);
  }
})();