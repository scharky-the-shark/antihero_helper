const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getConfig, updateConfig } = require("./utils/configManager");
const config = require("./Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Change bot configuration")
    .addStringOption(option =>
      option.setName("field")
        .setDescription("Field to change")
        .setRequired(true)
        .addChoices(
          { name: "Mod Role", value: "modRoleId" },
          { name: "Support Role", value: "adminRoleId" },
          { name: "Ticket Category", value: "ticketCategoryId" },
          { name: "Panel Channel", value: "startChannelId" }
        ))
    .addStringOption(option =>
      option.setName("value")
        .setDescription("New ID")
        .setRequired(true)
    ),

  async execute(interaction) {

    const executor = interaction.member;

    const isOwner = interaction.user.id === config.ownerUserId;
    const isAdmin = executor.roles.cache.has(config.adminRoleId);

    if (!isOwner && !isAdmin) {
      return interaction.reply({
        content: "❌ You are not allowed to change configuration.",
        ephemeral: true
      });
    }

    const field = interaction.options.getString("field");
    const value = interaction.options.getString("value");

    updateConfig({ [field]: value });

    await interaction.reply({
      content: `Configuration updated: ${field} → ${value}`,
      ephemeral: true
    });
  }
};
