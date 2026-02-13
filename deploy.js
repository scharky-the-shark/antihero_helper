const { REST, Routes } = require("discord.js");
const config = require("./Login.json");

const panel = require("./panel");
const exportCmd = require("./export");
const ticketCloseCmd = require("./ticketclose");
const warnCmd = require("./warn");
const banCmd = require("./ban");
const timeoutCmd = require("./timeout");
const infoCmd = require("./info");

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {

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
          infoCmd.data.toJSON()
        ]
      }
    );

    console.log("Commands registered successfully.");

  } catch (error) {
    console.error(error);
  }
})();
