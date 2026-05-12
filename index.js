const { Client, GatewayIntentBits, Collection } = require("discord.js");
const config              = require("./Login.json");

const panelCommand        = require("./panelUpdate.js");
const exportCommand       = require("./export");
const ticketCloseCommand  = require("./ticketclose");
const warnCommand         = require("./warn");
const banCommand          = require("./ban");
const timeoutCommand      = require("./timeout");
const infoCommand         = require("./info");
const configCommand       = require("./config");
const quarantineCommand  = require("./quarantine");
const purgeCommand       = require("./purge");
const clearuserCommand   = require("./clearuser");
const blockCommand       = require("./block");

const handleButtons       = require("./interaction");

// Boglog export
const fs = require("fs");
const path = require("path");

const logsPath = path.join(__dirname, "logs");
const logFile = path.join(logsPath, "bot.log");

// Falls logs-Ordner nicht existiert → erstellen
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath);
}

// Falls bot.log nicht existiert → erstellen
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "");
}

// Logging Funktion
function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

//channel export to dashboard
const exportsPath = path.join(logsPath, "exports");

if (!fs.existsSync(exportsPath)) {
  fs.mkdirSync(exportsPath);
}
require("dotenv").config();

//=== ERROR HANDLING === 
// FEHLER REAKTION
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);

});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);

});
//=== ERROR HANDLING END ===


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
  infoCommand,
  configCommand,
  quarantineCommand,
  purgeCommand,
  clearuserCommand,
  blockCommand
].forEach(cmd => {
  client.commands.set(cmd.data.name, cmd);
});

// ===== EVENT LOADER =====
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath);

for (const file of eventFiles) {

  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }

}

// Logger
client.on("messageCreate", require("./utils/logWriter"));
const { ActivityType } = require("discord.js");

// set Status on DC
client.once("ready", () => {

  client.user.setPresence({
    status: "dnd", // online | idle | dnd | invisible
    activities: [
      {
        name: "Moderation",
        type: ActivityType.Playing
      }
    ]
  });

  console.log(`Logged in as ${client.user.tag}`);
});



// on Interactions
client.on("interactionCreate", async (interaction) => {
log(`Command used: ${interaction.commandName} by ${interaction.user.tag}`);

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

client.login(config.token);
