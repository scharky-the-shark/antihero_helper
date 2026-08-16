const { SlashCommandBuilder, EmbedBuilder,  PermissionFlagsBits } = require("discord.js");
const { getConfig, updateConfig } = require("../utils/configManager");
const config = require("../Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Change bot configuration")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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

const SucEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("Success")
    .setDescription(
      `<:spray_checkx:1520804203218604062> Configuration updated: ${field} → ${value}.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_denied:1520804205814878469> You are not allowed to change configurationt.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

    const executor = interaction.member;

    const isOwner = interaction.user.id === config.ownerUserId;
    const isAdmin = executor.roles.cache.has(config.adminRoleId);

    if (!isOwner) {
    await interaction.reply({ embeds:[ErrEmbed], ephemeral: true });
    return;
    }

    const field = interaction.options.getString("field");
    const value = interaction.options.getString("value");

    updateConfig({ [field]: value });

    await interaction.reply({ embeds:[SucEmbed], ephemeral: true });
    
}};
