const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../Login.json");
const logger = require("../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Delete last 100 messages in this channel"),

  async execute(interaction) {
const SucEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("Success")
    .setDescription(
      `<:spray_checkx:1520804203218604062> 100 messages deleted.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_denied:1520804205814878469> You are not allowed to execute this command.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

    const executor = interaction.member;
    const modRoleId = config.modRoleId;
    const adminRoleId = config.adminRoleId;

    if (interaction.user.id !== config.ownerUserId) {
      const hasModRole = executor.roles.cache.has(modRoleId);
      const hasAdminRole = executor.roles.cache.has(adminRoleId);

      if (!hasModRole && !hasAdminRole) {
      await interaction.reply({ embeds:[ErrEmbed], ephemeral: true });
      return;
      }
    }

    const messages = await interaction.channel.messages.fetch({ limit: 100 });

    await interaction.channel.bulkDelete(messages, true);
    await interaction.reply({ embeds:[SucEmbed] });
    await logger.purge(
    interaction,
    messages.size
  );
}};