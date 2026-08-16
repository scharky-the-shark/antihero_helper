const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../Login.json");
const logger = require("../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearuser")
    .setDescription("Delete messages from a specific user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("amount").setDescription("Amount of messages").setRequired(true)
    ),

  async execute(interaction) {
const executor = interaction.member;
const targetUser = interaction.options.getUser("user");
const amount = interaction.options.getInteger("amount");
const messages = await interaction.channel.messages.fetch({ limit: 100 });

const filtered = messages
  .filter(m => m.author.id === targetUser.id)
  .first(amount);
const SucEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("Success")
    .setDescription(
      `<:spray_checkx:1520804203218604062> Deleted ${filtered.length} messages from ${targetUser.tag}`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_denied:1520804205814878469> You are not allowed to execute this command.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

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

    await interaction.channel.bulkDelete(filtered, true);

    await interaction.reply({
      content: `Deleted ${filtered.length} messages from ${targetUser.tag}`,
      ephemeral: true
    });
    await logger.purge(
    interaction,
    filtered.length
  );
}};