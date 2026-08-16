const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { sendLog }         = require("./webhookLogger");
const config              = require("./Login.json");
const memberWelcome       = require("./events/memberWelcome");

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

const panelCommand        = require("./panelUpdate.js");

const configStore         = require("./utils/configStore");
const regexCache          = require("./utils/regexCache");

const handleButtons       = require("./interaction");
const strings             = require("./stringHandler");
const handleModal         = require("./InteractionModal");


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
configStore.load();
regexCache.rebuild();

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
  banCommand,
  blockCommand,
  clearuserCommand,
  // clearStartCommand,
  // configCommand,
  // exportCommand,
  forceCommand,

  panelCommand,
  purgeCommand,
  quarantineCommand,
  resolveCommand,
  statsCommand,
  softbanCommand,
  setupCommand,
  ticketCloseCommand,
  timeoutCommand,
  warnCommand,
  test
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
const { ActivityType, EmbedBuilder } = require("discord.js");

client.on("guildMemberAdd", async (member) => {
  await memberWelcome(member);
});

// set Status on DC
client.once("clientReady", async () => {
    console.log(`Eingeloggt als ${client.user.tag}`);

    await sendLog(
        `Bot gestartet\nName: ${client.user.tag}`
    );

  client.user.setPresence({
    status: "dnd", // online | idle | dnd | invisible
    activities: [
      {
        name: "Support & Moderation",
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
      await sendLog(` /${interaction.commandName}\n ${interaction.user.tag}\n ${interaction.user.id}`);

      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      await command.execute(interaction);
      return;
    }

    // MODALS
    if (
      interaction.isModalSubmit() &&
      interaction.customId === "report_user"
    ) {
        return require("./support/discord/report")(interaction);
    }


    if (
      interaction.isModalSubmit() &&
      interaction.customId === "report_bug"
    ) {
        return require("./support/game/bugReportSubmit")(interaction);
    }


    if (
      interaction.isModalSubmit() &&
      interaction.customId === "report_player"
    ) {
        return require("./support/game/playerReportSubmit")(interaction);
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId === "nomail_submit_iOS"
    ) {
        return require("./interactions/support/nomailSubmit.js")(interaction);
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId === "nomail_submit_Android"
    ) {
        return require("./interactions/support/nomailSubmit.js")(interaction);
    }

    
    // Buttons
    if (interaction.isButton() || interaction.isStringSelectMenu()) {
      log(`Button used: ${interaction.customId} by ${interaction.user.tag}`);
      sendLog(`${interaction.customId}\n ${interaction.user.tag}\n ${interaction.user.id}`);

      await handleButtons(interaction);
      return;
    }

  } catch (error) {
    console.error("Interaction Error:", error);

    await sendLog(
      `<spray_crossx:1520804204384358420> Interaction Error\n` +
      `Type: ${
        interaction.isChatInputCommand() ? "Slash Command" : interaction.isButton() ? "Button" : "Unknown"
      }\n` +
      `Name: ${
        interaction.commandName ||
        interaction.customId ||
        "Unknown"
      }\n` +
      `User: ${interaction.user.tag} (${interaction.user.id})\n\n` +
      `\`\`\`\n${error.stack || error}\n\`\`\``
    );

const ErrEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Unknown Error")
    .setDescription(
      `<:hashtag:1520804246868463697> An error occurred.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
      embeds: [ErrEmbed],
      ephemeral: true
    });
    }
  }

});

client.login(config.token);
