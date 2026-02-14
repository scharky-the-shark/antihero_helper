require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const config = require("./Login.json");

const panelCommand        = require("./panel");
const exportCommand       = require("./export");
const ticketCloseCommand  = require("./ticketclose");
const warnCommand         = require("./warn");
const banCommand          = require("./ban");
const timeoutCommand      = require("./timeout");
const infoCommand         = require("./info");

const handleButtons       = require("./interaction");
const handleTicketButton  = require("./ticket");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// Slash Commands registrieren
[
  panelCommand,
  exportCommand,
  ticketCloseCommand,
  warnCommand,
  banCommand,
  timeoutCommand,
  infoCommand
].forEach(cmd => {
  client.commands.set(cmd.data.name, cmd);
});

// Logger
client.on("messageCreate", require("./utils/logWriter"));

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {

  try {

    // Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      await command.execute(interaction);
      return;
    }

    // Buttons
    if (interaction.isButton()) {
      return await handleButtons(interaction);
    }

  } catch (error) {
    console.error("Interaction Error:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "⚠️ An unexpected error occurred.",
        ephemeral: true
      });
    }
  }

});

client.login(process.env.DISCORD_TOKEN);
