const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { sendLog }         = require("./webhookLogger");
const config              = require("./Login.json");

const panelCommand        = require("./panelUpdate.js");
const exportCommand       = require("./export");
const ticketCloseCommand  = require("./ticketclose");
const warnCommand         = require("./warn");
const banCommand          = require("./ban");
const timeoutCommand      = require("./timeout");
const infoCommand         = require("./info");
const configCommand       = require("./config");
const quarantineCommand   = require("./quarantine");
const purgeCommand        = require("./purge");
const clearuserCommand    = require("./clearuser");
const blockCommand        = require("./block");
const memberWelcome       = require("./events/memberWelcome");
const resolveCommand      = require("./resolve");
const handleButtons       = require("./interaction");
const statsCommand        = require("./stats");

// Boglog export
const fs = require("fs");
const path = require("path");

const logsPath = path.join(__dirname, "logs");
const logFile = path.join(logsPath, "bot.log");

// logs-Ordner
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath);
}

// bot.log
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
process.on("unhandledRejection", async (err) => {
  console.error("UNHANDLED REJECTION:", err);

  await sendLog(
    `UNHANDLED REJECTION\n\`\`\`\n${err}\n\`\`\``
  );
});

process.on("uncaughtException", async (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);

  await sendLog(
    `UNCAUGHT EXCEPTION\n\`\`\`\n${err.stack || err}\n\`\`\``
  );
});
//=== ERROR HANDLING END ===


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
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
  blockCommand,
  resolveCommand,
  statsCommand,
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

client.on("guildMemberAdd", async (member) => {
  await memberWelcome(member);
});

// set Status on DC
client.once("ready", async () => {
    console.log(`Eingeloggt als ${client.user.tag}`);

    await sendLog(
        `Bot gestartet\nName: ${client.user.tag}`
    );

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

  try {

    // Slash Commands
    if (interaction.isChatInputCommand()) {

      log(`Command used: /${interaction.commandName} by ${interaction.user.tag}`);

      await sendLog(
        `📌 /${interaction.commandName}\n👤 ${interaction.user.tag}\n🆔 ${interaction.user.id}`
      );

      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      await command.execute(interaction);
      return;
    }

    // Buttons
    if (interaction.isButton()) {

      log(`Button used: ${interaction.customId} by ${interaction.user.tag}`);

      sendLog(
        `🔘 ${interaction.customId}\n👤 ${interaction.user.tag}\n🆔 ${interaction.user.id}`
      );

      await handleButtons(interaction);
      return;
    }

  } catch (error) {
    console.error("Interaction Error:", error);

    await sendLog(
      `❌ Interaction Error\n` +
      `Type: ${
        interaction.isChatInputCommand()
          ? "Slash Command"
          : interaction.isButton()
          ? "Button"
          : "Unknown"
      }\n` +
      `Name: ${
        interaction.commandName ||
        interaction.customId ||
        "Unknown"
      }\n` +
      `User: ${interaction.user.tag} (${interaction.user.id})\n\n` +
      `\`\`\`\n${error.stack || error}\n\`\`\``
    );

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "<:Tutle:1520804017192570880> An unexpected error occurred.",
        ephemeral: true
      });
    }
  }

});

client.login(config.token);
