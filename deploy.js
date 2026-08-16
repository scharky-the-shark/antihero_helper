const { REST, Routes } = require("discord.js");
const config          = require("./Login.json");

const banCommand          = require("./cmd/ban.js");
const blockCommand        = require("./cmd/block");
const clearuserCommand    = require("./cmd/clearuser");
const clearStartCommand   = require("./cmd/clearStart");
const configCommand       = require("./cmd/config");
const forceCommand        = require("./cmd/force.js");
const purgeCommand        = require("./cmd/purge");
const quarantineCommand   = require("./cmd/quarantine");
const resolveCommand      = require("./cmd/resolve.js");
const setupCommand        = require("./cmd/setup");
const softbanCommand      = require("./cmd/softban.js");
const statsCommand        = require("./cmd/stats");
const ticketCloseCommand  = require("./cmd/ticketclose");
const timeoutCommand      = require("./cmd/timeout");
const warnCommand         = require("./cmd/warn");
const test         = require("./cmd/test");

const panel           = require("./panelUpdate.js");

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {

    console.log("Registering slash commands...");

    await rest.put(
        Routes.applicationGuildCommands(
            config.clientId,
            config.guildId
        ), {
        body: [
          panel.data.toJSON(),
          ticketCloseCommand.data.toJSON(),
          warnCommand.data.toJSON(),
          banCommand.data.toJSON(),
          timeoutCommand.data.toJSON(),
          configCommand.data.toJSON(),
          quarantineCommand.data.toJSON(),
          purgeCommand.data.toJSON(),
          clearuserCommand.data.toJSON(),
          blockCommand.data.toJSON(),
          resolveCommand.data.toJSON(),
          statsCommand.data.toJSON(),
          softbanCommand.data.toJSON(),
          forceCommand.data.toJSON(),
          setupCommand.data.toJSON(),
          
          test.data.toJSON(),

        ]
      }
    );
    console.log("============ SUCCESS ============");
    console.log("Commands registered successfully.");

  } catch (error) {
    console.error("Command registration failed:", error);
  }
})();