require("dotenv").config();
const { REST, Routes } = require("discord.js");
const config = require("./Login.json");

const panel = require("./panel");
const exportCmd = require("./export");
const ticketCloseCmd = require("./ticketclose");
const warnCmd = require("./warn");
const banCmd = require("./ban");
const timeoutCmd = require("./timeout");
const infoCmd = require("./info");

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
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
